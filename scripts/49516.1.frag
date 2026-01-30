#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec2 cmul(vec2 a, vec2 b) { return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x); }

void main(void) {
	vec2 p = 2.0 * surfacePosition - vec2(0.7, 0.0);

	
	vec2 c = p;
	float it = 0.0;
	for(float i = 0.0; i<256.0; i+=1.0) {
		p = cmul(p, p) + c;
		if(length(p) >= 2.0) { it = i; break; }
	}

	gl_FragColor = vec4(vec3(sin(it / 10.0) * 0.5 + 0.5 ), 1.0);

}