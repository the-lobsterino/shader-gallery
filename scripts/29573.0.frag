#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ); //+ mouse / 4.0;

	float color = 1.0;
	float originx = 0.5;
	float originy = 0.5;
	
	color = sin( time * 9.*atan(0.1/sin(2.*((position.x - originx) * (position.y - originy)))) / 20.0 );

	gl_FragColor = vec4(vec3(color, color, color), 1.0);

}