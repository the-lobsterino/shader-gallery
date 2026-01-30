// Gradient Example
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define TopColor 		vec3( 0.0, 0.0, 1.0 )
#define MiddleColor 		vec3( 1.0, 1.0, 1.0 )
#define BottomColor 		vec3( 1.0, 0.0, 0.0 )
float dist=-2.0;

void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	uv.y *= dist;  //** dist var

	vec3 finalColor = vec3(0.0);
	if( uv.y <= 0.0 )
	{
		finalColor = mix( TopColor, MiddleColor, uv.y + 1.0 );
	}
	else
	{
		finalColor = mix( MiddleColor, BottomColor, uv.y );
	}
	
	
	gl_FragColor = vec4( finalColor, 1.0 );

}