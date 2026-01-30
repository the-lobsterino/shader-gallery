#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (2.0 * gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y);
	for(int i = 1; i < 7; i++) {
		p += sin(p.yx * 3.14 + sin(time * float(i) / 10.0) * 3.0);
	}
	float c = pow(max(0.0, p.x / 2.0 - 0.7), 2.0);
	gl_FragColor = vec4(vec3(c), 1.0);
}