// someone please make this shader with ones and zeros
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) 
{
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 3.0 - 1.0;
	uv.x *= resolution.x/resolution.y;
	
	vec3 finalColor = vec3( 0.0, 0.0, 0.0 );
	
	float g = -mod( gl_FragCoord.y + time, cos( gl_FragCoord.x ) + 0.4 );
	g = g + clamp(uv.y, -0.4, 0.2);	
	
	finalColor = vec3( 0.0, g - 0.4 , 0.0 );
	
	gl_FragColor = vec4( finalColor, 1.0 );

}