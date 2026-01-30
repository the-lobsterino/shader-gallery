#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse; 
uniform vec2 resolution;
 
float boxZ(vec3 p, float size){
	return length(max(abs(p.xy)-size,0.0));
}

float scene(vec3 p, float time) {
	float coobs = .6; 
	float box1 = boxZ((p+vec3(-2,.0,0.)), .5);
	coobs = min(box1,coobs);
	return min(coobs,-p.z);	
}

vec3 normal(vec3 p, float t){
	float d = 0.1;	
	float dx = scene(p + vec3(d, 0.0, 0.0), t) - scene(p + vec3(-d, 0.0, 0.0), t);
	float dy = scene(p + vec3(0.0, d, 0.0), t) - scene(p + vec3(0.0, -d, 0.0), t);
	float dz = scene(p + vec3(0.0, 0.0, d), t) - scene(p + vec3(0.0, 0.0, -d), t);
	return normalize(vec3(dx, dy, dz));
}

const float EPSILON = 0.001;
const float MAX_DIST = 20.0;

vec4 render(float t) {
	vec3 pos = vec3(0,0,-7);
	vec3 rayDir = normalize(vec3((gl_FragCoord.xy - resolution.xy * .5) / resolution.x, .5));

	// Raymarching loop
	
	float totalDist = 0.;
	
	for(int i = 0; i < 3000; i++) {
		// Evalulate the distance at the current point
		float dist = scene(pos, t); 
		// Advance the point forwards in the ray direction by the distance
		pos += dist*rayDir;
		totalDist += dist;
		if (dist < EPSILON || totalDist > MAX_DIST) break;
	}
	
	vec3 nrm = normal(pos, t);
	return vec4(vec3(0.0,1.,0.)/totalDist*(2.+nrm.y), 1.);
}


void main(void) {
	gl_FragColor = render(time);
}