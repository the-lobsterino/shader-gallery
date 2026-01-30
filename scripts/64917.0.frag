#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	float w = abs(sin(time * 0.5));
	
	//割った半分の数字で減算することによってそれぞれのqの中心が原点に
	vec2 q = mod(p, w) - (w/2.0);
	
	float r = abs(fract(time * 2.0));
	float g = abs(cos(time * 3.0));
	float b = abs(sin(time * 2.5));
	
	float f = r / q.x * q.y;
	float i = g / abs(q.x) * abs(q.y);
	float h = b / abs(q.x) * abs(q.y);

	gl_FragColor = vec4(f, i, h, 1.0);

}