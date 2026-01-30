#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy )-vec2(0.5,-0.05); 
	float color = 0.0;
	color+=atan(position.y,position.x)+position.y;
	color+=sin(5. *time+position.x+color*25.0)-1.0;
	color+=cos(15.*time+position.x+color*35.0)-1.0;
	
	gl_FragColor = vec4(  color,color*0.6, 0, 1.0 );
}