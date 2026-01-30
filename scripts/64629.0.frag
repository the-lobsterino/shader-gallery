/*
 * Original shader from: https://www.shadertoy.com/view/ttSGzd
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define PI 3.141592653589
#define STEPS 32
#define OCTAVES 5


mat3 rotateY(float a) {
	return mat3(
		vec3(cos(a), 0., -sin(a)),
		vec3(0, 1., 0.),
		vec3(sin(a), 0, cos(a))
		);
}

mat3 rotateX(float a) {
	return mat3(
		vec3(1., 0., 0.),
		vec3(0., cos(a), -sin(a)),
		vec3(0., sin(a), cos(a))
		);	
}

float random(vec2 st) {
	return fract(sin(dot(st, vec2(15.13123, 45.56251))) * 45666.12) *2.-1.;
}

float noise(vec2 st) {
	vec2 i = floor(st);
	vec2 f = fract(st);
	// Create grid to spread out our noise
	float a = random(i);
	float b = random(i + vec2(1.0, 0.0));
	float c = random(i + vec2(0.0, 1.0));
	float d = random(i + vec2(1.0, 1.0));
	// Create our hermite cubic interpolation
	vec2 h = f * f * (3.0 - 2.0 * f);
	// Do our bilinear interpolation:
	return 	mix(a, b, h.x) + 
			(c - a) * h.y * (1.0 - h.x) +
			(d - b) * h.x * h.y;
}

float fbm(vec3 p){
	float amp = 2.0;
	float fbm = 0.;
	float scale = 2.0;
	for(int i = 0; i < OCTAVES; i++){
		fbm += noise(p.xy) * amp;
		p *= scale;
		amp *= 0.5;
	}
	return fbm;
}

float sphere(vec3 p, float r) {
	return length(p) - 0.5 * r;
}

float fTorus(vec3 p, float smallRadius, float largeRadius) {
	p *= rotateX(-PI*0.35);
	return length(vec2(length(p.xz) - largeRadius, p.y)) - smallRadius;
}

float scene(vec3 p) {
	p *= rotateY(PI*iTime);
	float noisySphere = max(sphere(p + fbm(p)*0.5, 12.), sphere(p, 12.));
	float torus = fTorus(p, 6.9, 9.);
	return max(torus, noisySphere);
}

vec3 getNormals(vec3 p) {
	vec3 delta = vec3(0.01, 0., 0.);
	float x = scene(p + delta.xyy) - scene(p - delta.xyy);
	float y = scene(p + delta.yxy) - scene(p - delta.yxy);
	float z = scene(p + delta.yyx) - scene(p - delta.yyx);
	return normalize(vec3(x, y, z));
}

float rayMarching(vec3 pos, vec3 dir, out vec3 p) {
	float currentDist = 0.;
	const float min = 0.01;
	const float max = 1000.0;
	for(int i = 0; i < STEPS; ++i) {
		p = pos + (dir * currentDist);
		float distance2Obj = scene(p);
		if(distance2Obj < min) {
			break;
		}
		currentDist += distance2Obj;
		if(currentDist > max) {
			currentDist = 0.;
			break;
		}
	}
	return currentDist;
}


// Standard Blinn lighting model.
// This model computes the diffuse and specular components of the final surface color.
vec3 calculateLighting(vec3 pointOnSurface, vec3 surfaceNormal, vec3 lightPosition, vec3 cameraPosition, vec3 col)
{
	vec3 fromPointToLight = normalize(lightPosition - pointOnSurface); // Get normal
	float diffuseStrength = clamp( dot( surfaceNormal, fromPointToLight ), 0.0, 1.0 );
	vec3 diffuseColor = diffuseStrength * col;
	vec3 reflectedLightVector = normalize( reflect( -fromPointToLight, surfaceNormal ) );
	vec3 fromPointToCamera = normalize( cameraPosition - pointOnSurface );
	float specularStrength = pow( clamp( dot(reflectedLightVector, fromPointToCamera), 0.0, 1.0), 10.0);
	// Ensure that there is no specular lighting when there is no diffuse lighting.
	specularStrength = min( diffuseStrength, specularStrength );
	vec3 specularColor = specularStrength * vec3( 1.0 );
	vec3 finalColor = diffuseColor + specularColor;
	return finalColor;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
	vec2 st = gl_FragCoord.xy / iResolution.xy * 2. - 1.;
	st.x *= iResolution.x / iResolution.y;

	// Define camera properties
	vec3 cameraPos = vec3(0., 0., -10.0);
	vec3 cameraDir = vec3(st.x, st.y, 1.);
	vec3 color = vec3(length(st))*0.05;
	vec3 p;
	float r = rayMarching(cameraPos, cameraDir, p);
	
	if(r > 0.0) {
		vec3 normals = getNormals(p);
		vec3 lightPosA = vec3(-12., 0., 0.);
		vec3 lightPosB = vec3(9., 0., -10.);
		float fbmCol = abs(fbm(p*4.0));
		vec3 colA = mix(vec3(cos(iTime)*0.5+0.5, .5, 0.25), vec3(0.1, 0.5, 0.9), fbmCol);
		vec3 colB = mix(colA, vec3(0.9, 0.9, 0.9), fbmCol);
		color = calculateLighting(p, normals, lightPosA, cameraPos, colA);
		color += calculateLighting(p, normals, lightPosB, cameraPos, colB);	
	}

	fragColor = vec4(color, 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}