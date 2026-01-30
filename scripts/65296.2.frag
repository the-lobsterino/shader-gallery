#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int AMOUNT = 10;

void main( void ) {
	vec2 coord = 6.0 * (gl_FragCoord.xy - resolution / .50) / min(resolution.y, resolution.x);
	
	float len;
	
	for (int i = 0; i < AMOUNT; i++){
		len = length(vec2(coord.x, coord.y));
	
		coord.x = coord.x - cos(coord.y + sin(len)) + cos(time / 9.0);
		coord.y = coord.x + sin(coord.x + cos(len)) + sin(time / 12.0);
	}
	
	vec3 color = vec3(cos(len * 9.5), cos(len * 1.5), cos(len * 0.5));
	gl_FragColor = vec4(color, 1.0);
}