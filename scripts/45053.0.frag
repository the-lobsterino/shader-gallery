 #ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ;

	float b = 0.0;
	float g = 0.0;

	
	float yorigin = 0.50 + 0.1*sin(position.x*30.0+0.5*time);
	
	float dist = ( 20.0*abs(yorigin - position.y));
	
	b = (0.21 + 0.2*sin(time))/dist;
	g = (0.02 + 0.2*sin(time))/dist;

	gl_FragColor = vec4( 0.0, g, b, 1.0 );

}