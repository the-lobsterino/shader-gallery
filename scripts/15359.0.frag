#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 eye = vec3(1.0,0.0,-10.0);
const float screenZ = -1.0;
const float noInter = -100000.0;
const vec4 sphere = vec4(0.0,0.0,0.0,0.7);
const vec3 light = vec3(1.0,10.0,-10.0);

const vec3 ambient = vec3(0.2,0.0,0.0);
const vec3 diffuse = vec3(1.0,0.0,0.0);
const vec3 specular = vec3(1.0,1.0,1.0);
const float specularPower = 30.0;

float intersectSphere(vec3 rayStart, vec3 rayDir, vec4 sphere, out vec3 inter) {
	
	float t0, t1, t;
	
	vec3 l = sphere.xyz - rayStart;
	float tca = dot(l, rayDir);
	if ( tca < 0.0 )
		return noInter;
	float d2 = dot (l, l) - (tca * tca);
	float r2 = sphere.w*sphere.w;
	if ( d2 > r2 )
		return noInter;
	float thc = sqrt(r2 - d2);
	t0 = tca - thc;
	t1 = tca + thc;
		
	if ( t0 < 0.0 )
		t = t1;
	else if ( t1 < 0.0 )
		t = t0;
	else
		t = min(t0,t1);
	
	inter = rayStart + t * rayDir;
	
	return t;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy * 2.0 ) - 1.0;
	position.x *= resolution.x / resolution.y;
	vec3 rayStart = vec3(position.xy, screenZ);
	vec3 rayDir = normalize(rayStart-eye);
	vec3 inter;
	vec3 normal;
	vec3 colour = vec3(0.0,0.0,0.0);
	vec3 lightDir, eyeDir, reflected;
	float t = intersectSphere(rayStart, rayDir, sphere, inter);
	if (t != noInter) {
		normal = normalize(vec3(inter-sphere.xyz));
		
		lightDir = normalize(light - inter);
		eyeDir = normalize ( eye - inter );
		colour += ambient;
		colour += diffuse * max(dot(normal, lightDir), 0.0);
		reflected =  normalize ( reflect ( -lightDir, normal ) );
		colour += specular * pow ( max ( dot(reflected, eyeDir), 0.0), specularPower );
				
	}
	gl_FragColor = vec4(colour, 1.0);
}