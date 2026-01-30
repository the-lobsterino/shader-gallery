#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Data structures

struct toonMat {
	vec3 highlight;
	vec3 shadow;
};

struct marchOut {
	toonMat mat;
	vec3 pos;
	bool hit;
};

struct sdfOut {
	toonMat mat;
	float dist;
};
	
// Lerping functions

#define defLerp(T) T lerp(T a, T b, float t) { return a*(1.0-t) + b*t;}
defLerp(float)
defLerp(vec2)
defLerp(vec3)
defLerp(vec4)

toonMat lerp(toonMat a, toonMat b, float t) {
	return toonMat(lerp(a.highlight, b.highlight, t), lerp(a.shadow, b.shadow, t));
}

// Element-wise vector max doesn't work everywhere
vec3 vecmax(vec3 a, vec3 b) {
	return vec3(max(a.x, b.x), max(a.y, b.y), max(a.z, b.z));
}
	
// Constants

const float FOV = 90.;
const float PI = 3.14159265;
const float EPSILON = 1e-4;
const float INF = 3.4e38;
const int MAX_STEPS = 256;
const vec3 SKY_COLOR = vec3(0., .5, .75);
const vec3 AMBIENT_COLOR = vec3(0.);
const float OUTLINE_DIST = 0.1;
const float LIGHT_THRESHOLD = 0.5;


// Translation matrices

mat3 rotX( float angle ) {
	float c = cos(angle);
	float s = sin(angle);
	return mat3(
		vec3( 1., 0.,  0.),
		vec3( 0., c , -s ),
		vec3( 0., s,   c )
	);
}

mat3 rotY( float angle ) {
	float c = cos(angle);
	float s = sin(angle);
	return mat3(
		vec3( c , 0.,  s ),
		vec3( 0., 1.,  0.),
		vec3(-s , 0.,  c )
	);
}

mat3 rotZ( float angle ) {
	float c = cos(angle);
	float s = sin(angle);
	return mat3(
		vec3( c ,-s , 0.),
		vec3( s , c , 0.),
		vec3( 0., 0., 1.)
	);
}

// SDF helpers

sdfOut sdfUnion (sdfOut a, sdfOut b) {
	bool aIsMin = a.dist < b.dist;
	if (aIsMin) { // Ternary operator not allowed for structs
		return a;
	} else {
		return b;
	}
}


sdfOut sdfIntersect (sdfOut a, sdfOut b) {
	bool aIsMax = a.dist > b.dist;
	if (aIsMax) { // Ternary operator not allowed for structs
		return a;
	} else {
		return b;
	}
}

sdfOut sdfLerp (sdfOut a, sdfOut b, float t) {
	return sdfOut(
		lerp(a.mat, b.mat, t),
		lerp(a.dist, b.dist, t)
	);
}

// SDF objects

sdfOut sdfPlane ( toonMat col, vec3 position, vec3 normal) {
	return sdfOut(col, dot(position, normal));
}

sdfOut sdfSphere ( toonMat col, vec3 position, float radius) {
	return sdfOut(col, length(position) - radius);
}

sdfOut sdfBox (toonMat col, vec3 position, vec3 bound) {
	vec3 signedVec = abs(position)-bound;
	return sdfOut(col, max(max(signedVec.x, signedVec.y), signedVec.z));
}

// SDF scene

sdfOut sceneSDF(vec3 pos) {
	vec3 checkerColor = vec3(abs(step(sin(pos.x), 0.) - step(sin(pos.z), 0.))) * 0.5 + 0.5;
	return 
	sdfUnion(
		sdfUnion(
			sdfPlane(
				toonMat(checkerColor, checkerColor * 0.4), 
				pos, vec3(0, 1., 0.)
			),
			sdfSphere(
				toonMat(vec3(1., 0., 0.1), vec3(0.3, 0.0, 0.1)),
				pos - vec3(0., 3., 5.),
				2.
			)
		),
		sdfIntersect(
			sdfBox(
				toonMat(vec3(.5, .3, .2), vec3(.3, .2, .15)),
				rotZ(time)*rotY(time*2.)*(pos - vec3(5., 6., -6.)),
				vec3(2., 3., 2.)
			),
			sdfBox(
				toonMat(vec3(1., 1., 1.), vec3(0.5, 0.57, 0.6)),
				rotX(time*.3)*rotY(time*-.7)*(pos - vec3(4., 6., -6.)),
				vec3(2., 3., 2.)
			)
		)
	);
}

// Marching

vec3 calcNormal( vec3 pos ) {
	highp float distHere = sceneSDF(vec3(pos.x, pos.y, pos.z)).dist;
	return normalize(
		vec3(
			sceneSDF(vec3(pos.x + EPSILON, pos.y, pos.z)).dist - distHere,
			sceneSDF(vec3(pos.x, pos.y + EPSILON, pos.z)).dist - distHere,
			sceneSDF(vec3(pos.x, pos.y, pos.z + EPSILON)).dist - distHere
		)
	);
}

marchOut march( vec3 pos, vec3 dir) {
	float depth = 0.;
	float dist = INF;
	for (int i = 0; i < MAX_STEPS; i++) {
		sdfOut currHit = sceneSDF(pos);
		if (currHit.dist < EPSILON) {
			return marchOut(currHit.mat, pos, true);
		} else if (dist < currHit.dist && currHit.dist < OUTLINE_DIST) {
			return marchOut(toonMat(vec3(0), vec3(0)), pos, true);
		}
		pos += normalize(dir) * currHit.dist;
		depth += currHit.dist;
		dist = currHit.dist;
	}
	return marchOut(toonMat(vec3(0), vec3(0)), pos, false);
}

vec3 normalRawToColor(vec3 normal) {
	return (normal / 2.) + .5;
}

// Phong illumination

struct pointLight{
	vec3 position;
	vec3 color;
	float intensity;
};

const int NUM_LIGHTS = 1;

// Using a directional light

vec3 phongLight(marchOut mOut, vec3 cameraPos) {
	vec3 outColor = vec3(0);
	pointLight lights[NUM_LIGHTS];
	lights[0] = pointLight(
		vec3(0, 20, 0),
		vec3(1., 1., 1.),
		4.
	);
	vec3 normal = calcNormal(mOut.pos);
	for (int i = 0; i < NUM_LIGHTS; i++) {
		pointLight light = lights[i];
		vec3 lightDir = normalize(mOut.pos - light.position);
		bool hit = distance(march(light.position, lightDir).pos, mOut.pos) > EPSILON*10.;
		if (!hit) {
			vec3 cameraDir = normalize(cameraPos - mOut.pos);
			float lightIntensity = dot(-lightDir, normal);
			lightIntensity *= 1. / pow(distance(light.position, mOut.pos) * 0.1, 2.);
			lightIntensity *= light.intensity;
			hit = lightIntensity < LIGHT_THRESHOLD;
		}
		vec3 rawColor = hit ? mOut.mat.shadow : mOut.mat.highlight;
		outColor += light.color * (vecmax(vec3(0.), rawColor));
	}
	return outColor;
}

// Main function

void main( void ) {
	float screenMin = min(resolution.x, resolution.y);
	vec2 screenMult = vec2(resolution.x / screenMin, resolution.y / screenMin);
	
	vec3 cameraRot = vec3(
		(mouse.y - .5) * PI * screenMult.y, 
		(.5 - mouse.x) * 2. * PI * screenMult.x, 
		0.
	);
	vec3 cameraPos = vec3(
		sin(time*.9),
		3.,
		cos(time*1.2)
	);
	
	vec2 rawUVPos = gl_FragCoord.xy / resolution;
	vec2 rawScreenPos = (rawUVPos - 0.5) * 2.;
	vec2 screenPos = rawScreenPos * screenMult;
	vec3 localCastDir = normalize(vec3(screenPos, 1. / tan(radians(FOV / 2.))));
	vec3 castDir = 
		rotY(cameraRot.y)*
		rotX(cameraRot.x)*
		rotZ(cameraRot.z)*
		localCastDir;
	castDir = vec3(castDir.x, castDir.y, castDir.z);
	
	vec3 color = phongLight(march(cameraPos, castDir), cameraPos);
	
	gl_FragColor = vec4(color, 1.0);
}