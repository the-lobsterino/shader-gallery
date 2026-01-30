precision highp float;
uniform float time;
uniform vec2  resolution;

#define FOG_STRENGTH 1.0

const float PI = 3.14159265;
const float angle = 150.0;
const float fov = angle * 0.5 * PI / 180.0;

vec3  cPos = vec3(0.0,0.0, 2.0 - time*2.5);   // movement
float sphereSize = 1.2;
const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

vec3 trans(vec3 p){
	return mod(p, 6.0) - 3.0;
}

float distanceFunc(vec3 p){
	return length(trans(p)) - sphereSize;
}

vec3 getNormal(vec3 p){
	float d = 0.01;
	return normalize(vec3(
		distanceFunc(p + vec3(  d, 0.0, 0.0)) - distanceFunc(p + vec3( -d, 0.0, 0.0)),
		distanceFunc(p + vec3(0.0,   d, 0.0)) - distanceFunc(p + vec3(0.0,  -d, 0.0)),
		distanceFunc(p + vec3(0.0, 0.0,   d)) - distanceFunc(p + vec3(0.0, 0.0,  -d))
	));
}

void main(void){
	// fragment position
	vec2 p = 1.5*(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	// ray
	vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));	
	
	// marching loop
	float distance = 0.0;
	float rLen = 0.0;
	vec3  rPos = cPos;
	for(int i = 0; i < 128; i++){
		distance = distanceFunc(rPos);
		rLen += distance;
		rPos = cPos + ray * rLen;
	}
	// the fog
	float fog = 1.0 - pow(75.0/rLen, FOG_STRENGTH);
	vec3 c = vec3(0.0);
	// hitting
	
		vec3 normal = getNormal(rPos);
		float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
		c = vec3(0.25*diff+0.75*(normal*0.5+0.5));
	
	gl_FragColor = vec4(c, fog);
}