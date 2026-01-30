#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x );
	
	float ltt = cos(4.0*cos(10.0)/10.0+50.0*(length(position-vec2(0.5,0.25))+(atan(-position.y+0.25,position.x-0.5)*0.1+0.5)));
	
	gl_FragColor = vec4( ltt*1.2 ,0 ,0 ,1 );

}