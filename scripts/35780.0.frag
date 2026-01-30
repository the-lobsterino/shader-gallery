#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	vec2 uv = (2.0 * gl_FragCoord.xy / resolution.xy - 1.0) * vec2(resolution.x / resolution.y, 1.0);
	
	float a = 4.0*atan(uv.y / uv.x);
	uv /= 0.5 + 0.02 * sin(6.0 * a - time * 16.0)*cos(time/a);
	uv*=0.5/sin(a) ;
	
	float f = 1.40 + 0.2 * cos(time * 0.14);
	float d = (abs(length(uv) - f) * 10.0);
	
	gl_FragColor += vec4(0./d, 0.2/d, 2.22/d, 1);
}