#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



void main( void ) {

	vec2 pixPos = vec2(gl_FragCoord.x, gl_FragCoord.y)/5.0;
	vec2 squarePos10 = vec2(floor(pixPos.x*10.0), floor(pixPos.y*10.0));
	vec2 squarePos = vec2(squarePos10.x/10.0, squarePos10.y/10.0)/150.0;

	//gl_FragColor = vec4(squarePos.x+sin(time*2.0), squarePos.y+sin(time*2.0),  1.0, 1.0);
	gl_FragColor = vec4(squarePos10/1000.0+sin(time/+squarePos/10.0), 1.0, 1.0);
	
	gl_FragColor = vec4(time,0.0,0.0,1.0);
	
}