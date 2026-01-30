// Woah... where am I?
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float shape( vec3 p, float r )
{
	return length(cos(sin(p)*1.90)*0.72) - r;
}

float scene( vec3 pos )
{
	pos = mod(pos, 4.0 ) - 2.0;
	return shape( pos, 1.0 );
}

void main( void ) 
{
	vec3 finalColor = vec3( 0.0 );
	
	vec2 ouv = gl_FragCoord.xy / resolution.xy;
	vec2 uv = ouv * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	
	float sx = sin(time * 0.5)* 0.5 + 0.5;
	float sy = sin(time * 0.3)* 0.5 + 0.5;
	float cx = mix( -1.0, 1.0, sx);
	float cy = mix( -1.0, 1.0, sy);
	
	vec3 pos = vec3( 0.0, 0.0, -1.0 + time );
	vec3 look = normalize( vec3( uv.x + cx, uv.y + cy, 1.0 ) );
	
	float totalDist = 0.0;
	float inv = 1.0 / 30.0;
	
	for( int i=0; i < 100; ++i)
	{
		float dist = scene(pos);
		totalDist += dist;
		
		if( dist < 0.001 )
		{
			float t = 1.0-(totalDist * inv);
			t = t*t*(3.0-2.0*t);
			
			finalColor = vec3( t );
		}
		else if( dist > 1000.0 )
		{
			break;
		}
		
		pos = pos + look * dist;
		
	}

	gl_FragColor = vec4( finalColor, 1.0 );

}