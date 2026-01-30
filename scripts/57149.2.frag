#ifdef GL_ES
precision highp float;
#endif

#define SCALE 3.5
#define EPS 0.001
#define MAXSTEP 200
#define MAXDIST 30.0
#define START 10.0

const vec3 cpos = vec3(0, 0, 10);

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float cube(vec3 p, vec3 c, float s);
float maps(vec3 p);

vec4 draw(vec2 c, vec3 p, vec3 d);

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.5;

	gl_FragColor = draw(position * 32.0, vec3(0), normalize(vec3(0.5, 0.5, 1)));
}

// raymarcher steps based on map field
// normals calculated via gradient
// cubes could be done pretty fast i think

vec4 draw(vec2 c, vec3 p, vec3 d) {
	vec3 pos = vec3(sin(time) * 15.0, cos(time) * 15.0, -6);
	vec3 dir = normalize(vec3(c.xy, 0) - pos);
	float dist = maps(pos);
	
	for(int i = 0; i < MAXSTEP; i++) {
		if (dist > MAXDIST) {
			
			return vec4(0);
			
		} else if (dist < EPS) {
			
			return vec4(1);
			
		}
		
		pos += dir * dist;
		dist = maps(pos);
		
	}
	
	return vec4(0);
	
}

float maps(vec3 p) {
	return cube(p, cpos, SCALE);
}

float cube( vec3 p, vec3 c, float s) {
	vec3 d = abs(p - c) - vec3(s);
	return length(max(d, 0.0)) + min(max(max(d.x, d.y), d.z), 0.0);
	
}