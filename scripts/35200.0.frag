#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) 
{
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x/resolution.y;
	
	uv.y += 1.0;
	
	uv *= 100.0;
	
	vec3 finalColor = vec3( 0.0, 0.0, 0.0);
	
	float g =  mod( uv.x , cos( uv.y + 2.7 * time ) - 0.25 );

	g = g + clamp(uv.y, -0.25, 0.25);	
	
	finalColor += vec3( g, 0.2, 0.7 );
	
	gl_FragColor = vec4( finalColor, 1.0 );

}