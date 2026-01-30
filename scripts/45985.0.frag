#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (2.0 * gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y) * 1.0;
	for(int i = 1; i < 5; i++) {
		p += sin(p.yx * vec2(1.6, 1.1) * float(i + 5) + time * float(i) * vec2(3.4, 0.5) / 10.0) * 0.1;
	}
	float c = (abs(sin(p.y + time * 0.0) + sin(p.x + time * 0.0))) * 0.5;
	gl_FragColor = vec4(vec3(c), 3.0);
}