#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv *=  1.0 - uv.yx;
	uv *= resolution / 100.0;
	float vig = uv.x*uv.y * 1.5;
	vig = pow(vig, 0.25);
	
	float vigI = 2.0-vig;
	
	vec4 a = vec4(1.0,0.0,5.0, vigI) * vigI/2.0;
	gl_FragColor = a; 

}