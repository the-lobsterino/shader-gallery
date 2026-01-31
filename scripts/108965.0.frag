#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy*2.-1. ) - (mouse -1.);
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy )*2.-1.;

	
	float d = length(position*2.-1.);

	float color = 0.0;
	
	vec3 col = vec3(uv,0.);
	
	//col = fract(col*4.);
	
	col = col*d;

	gl_FragColor = vec4(col, 1.0 );

}