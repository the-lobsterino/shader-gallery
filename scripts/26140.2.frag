// by @mnstrmnch

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float barWidth = 0.05;
float PI = 3.14159265;

vec3 c0 = vec3( 255.0, 125., 0. ) / vec3( 255.0 );
vec3 c1 = vec3( 1.0, 0.   , 0.0 );

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xx ) * 2.0 - vec2( 1.0, resolution.y / resolution.x );

	vec3 color = vec3( 0.0 );

	for( int i = 20; i >= 0; i-- )
	{
		float barY = 0.02+sin( time * 0.4 + float( i*10 ) * 0.2 );

		if( p.x> barY - barWidth * 0.5 && p.x < barY + barWidth * 0.5 )
		{
			float angle = ( ( p.x - ( barY - barWidth * 0.5 ) ) / barWidth );
			color = mix( c0.zyx, c1.zyx, float( i )/10. ) * vec3( sin( angle * PI ) );
		}
	}

	


	gl_FragColor = vec4( color, 1.0 );

}