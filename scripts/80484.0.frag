#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float rndc = sqrt(43758.5453123);

float rand (float n) { return fract(sin(n) * rndc); }

void rect(vec2 p, vec2 offset, float size, vec3 color, inout vec3 i) {
	vec2 q = (p - offset) / size;
	if (abs(q.x) < 1.0 && abs(q.y) < 1.0) {
		i = vec3(q.x, q.y, 1) + color; 
	}
}

void main( void ) {	
	vec2 p = (gl_FragCoord.xy) / min(resolution.x, resolution.y);

	vec3 dest = vec3(0,0,0);
	
	float t = (sin(time * rand(float(p.x * p.y))) + 1.0) * 0.15;
	float x = rand(float(p.x));
	float y = rand(float(p.y));
 	rect(p, vec2(x, y), t, vec3(0.2,0.2,0.2), dest);
	gl_FragColor = vec4(dest, 2.0);
}
