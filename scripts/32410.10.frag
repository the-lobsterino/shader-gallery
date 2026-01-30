#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define sphere length(p) - 1.
#define sphere2 length(p+vec3(0.8)) - 1.
#define sphere3 length(p+vec3(2.,0.,0.)) - 1.
#define sphere4 length(p+vec3(-2.,1.,-1.)) - 1.
#define sphere5 length(p+vec3(-3,1.,-1.)) - 1.
#define sphere6 length(p+vec3(-0.,3.,-1.)) - 1.
#define sphere7 length(p+vec3(-2.,6.,-2.)) - 0.9

float scene(vec3 p, float time) {
	
	float right = min(min(min(min(min(min(min(sphere,1.),min(sphere2,1.)),min(sphere3,1.)),sphere4),sphere5),sphere6),sphere7);
	
	return right;	
}

vec3 normal(vec3 p, float t){
	float d = 0.5;	
	float dx = scene(p + vec3(d, 0.0, 0.0), t) - scene(p + vec3(-d, 0.0, 0.0), t);
	float dy = scene(p + vec3(0.0, d, 0.0), t) - scene(p + vec3(0.0, -d, 0.0), t);
	float dz = scene(p + vec3(0.0, 0.0, d), t) - scene(p + vec3(0.0, 0.0, -d), t);
	return normalize(vec3(dx, dy, dz));
}

const float EPSILON = 0.001;
const float MAX_DIST = 20.0;

vec4 render(float t) {
	vec3 pos = vec3(0,0,-7);
	vec3 dir = normalize(vec3((gl_FragCoord.xy - resolution.xy * .5) / resolution.x, .5));

	// Raytracing loop
	
	float what = 0.;
	for(int i = 0; i < 13; i++) {
		float dist = scene(pos, t);
		pos += dist*dir;
		what += dist;
	}
	
	vec3 nrm = normal(pos, t);
	return vec4(vec3(0.0,1.,0.)/what*(2.+nrm.y), 1.);
}


void main(void) {
	gl_FragColor = render(time);
}