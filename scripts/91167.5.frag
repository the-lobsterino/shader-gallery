#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float NEAR = 1.;
const float MAX_ITERATIONS = 128.;
const float HIT_THRESHOLD = 0.00001;

vec3 getRayDirection() {
	float maxd = max(resolution.y, resolution.x);
	// ranges from  -1 to 1 in x and y
	vec2 pos = (gl_FragCoord.xy - resolution.xy / 2.) / (maxd / 2.); 
	vec3 on_near_plane = vec3(pos, NEAR);
	return on_near_plane / length(on_near_plane);
}

vec3 opRotateY(vec3 p, float angle) {
	float c = cos(angle);
	float s = sin(angle);
	return vec3(
		c * p.x - s * p.z,
		p.y,
		s * p.x + c * p.z
	);
}

vec3 opTranslate(vec3 p, vec3 offset){ 
	return p + offset;	
}

vec3 opRepeat(vec3 p, vec3 repeat) {
	return mod(p, repeat);	
}

float sphere(vec3 p, float r) {
	return length(p) - r;	
}

float box(vec3 p, vec3 sides) {
	vec3 dps = abs(p) - sides;
	return max(dps.x, max(dps.y, dps.z));
}

float sdf(vec3 p) {
	p = opTranslate(p, vec3(0, time, 0));
	p = opRepeat(p, vec3(0, 2., 0));
	p = opTranslate(p, vec3(0, -1., 0));
	p = opRotateY(p, time + p.y);
	float s = sphere(p, 1.);
	float b = box(p, vec3(2., .3, .3));
	float b2 = box(p, vec3(.3, .3, 2.));
	float boxes = min(b, b2);
	return max(s, boxes);
}

void main( void ) {
	vec3 direction = getRayDirection();
	vec3 position = vec3(0, 0, -5);
	
	float iterations = 0.;
	for(float i = 0.; i < MAX_ITERATIONS; i++) {
		float dist = sdf(position);
		if (dist < HIT_THRESHOLD) {
			break;	
		}
		position = position + dist * direction;
		iterations = i;
	}
	
	float c = (MAX_ITERATIONS - iterations) / MAX_ITERATIONS;
	gl_FragColor = vec4(vec3(c), 1.);
}