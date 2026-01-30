// Trig Wave
// By: Brandon Fogerty
// bfogerty at gmail dot com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define STEP_SIZE 			0.04


float pulse( float value, float minNum, float maxNum )
{
	return step( minNum, value ) - step( maxNum, value );
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;

	vec3 c = vec3( 0, 0, 0 );
	// Decrease the 0.04 step size to make the curve look more filled.
	for( float xp = -1.0; xp < 1.0; xp += STEP_SIZE )
	{
		float t = xp / 1.0;
		float x = pulse( pos.x, xp, xp + 0.02 ); 
		float y = pulse( pos.y, -1.0, -1.0 + sin( time + xp ) * 0.90  );		
		c += vec3( 0, pos.y + y, pos.x + x ) * x * y;
		
		y = pulse( pos.y, 1.0, 1.0 - sin( time - xp*t ) * 0.90  );
		c += vec3( pos.y + y, 0, 0 ) * x * y;
	}
	
	gl_FragColor = vec4( c, 1 );

}