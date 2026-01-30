#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

void main( void ) {
	float pi = 3.1415;
	vec2 uv = gl_FragCoord.xy / resolution;
	float cxp = uv.x - 0.5;
	float cyp = uv.y - 0.5;
	float dist = sqrt(cxp * cxp + cyp * cyp);
	
	float b = abs(sin(uv.x*100.*pi));

	gl_FragColor = vec4(0., b*0.1, b*0.1, 1.0);

}