#ifdef GL_ES
precision lowp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 color = vec3(0.0, 1.0, 0.0);

#define CROSSHAIRS_WITH_DISTANCE 0
#define CROSSHAIRS_WITH_POW 1 

void main( void ) {

	vec2 currentPixel = gl_FragCoord.xy / resolution.xy;

	/*
	// CROSSHAIRS_WITH_DISTANCE
	*/
	if( CROSSHAIRS_WITH_DISTANCE == 1 ){
		
		// work in progress
		color -= distance( currentPixel.x, mouse.x ) * 50.0;
		//color -= distance( currentPixel.x, mouse.x ) * 50.0;
		
	}
	
	/*
	// CROSSHAIRS_WITH_POW
	*/
	if( CROSSHAIRS_WITH_POW == 1 ){
		
		color -= pow( distance( currentPixel.x, mouse.x ) * 0.01 , 0.15 );
		color -= pow( distance( currentPixel.y, mouse.y ) * 0.01 , 0.1 );
		
	}
	
	gl_FragColor = vec4( color, 1.0 );

}