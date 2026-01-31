#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float varu = 0.1;
	
	float color = 0.5;
	vec2 position = ( gl_FragCoord.xy / resolution.xy) ;	
	
	if(position.y < 0.5 - 0.1 * sin(time) ){
		gl_FragColor = vec4(  color , color, color, 1.0 );
	}
}