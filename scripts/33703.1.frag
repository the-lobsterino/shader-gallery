#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;

float n = 2.0;
float m = 2.0;

void main(void) {
	vec2 p = gl_FragCoord.xy / resolution.xy;
	vec2 s = vec2(floor(p.x * m), floor(p.y * n));
	float c = 1.0;
	if (mod(s.x + s.y, 2.0) < 1.0) {
		c = 1.0;
	} else {
		c = 0.0;
	}
	
//	c = 1.0-c;

	c = mix(c,1.0-c,(0.5+0.5*cos(time*5.0)));
	
	gl_FragColor = vec4(c, 0., 1.0-c, 1.0);
}