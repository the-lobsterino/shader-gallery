// Simple Ray Marching
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float sphere( vec3 p, float radius )
{
	return length(p) - radius;
}

float box( vec3 p, vec3 b )
{
  return length(max(abs(p)-b,0.0));
}

float scene( vec3 p )
{
	return max(-sphere( p, 0.9 ),  box( p, vec3( .9 ) ) ) * (box( p, vec3(0.5, 0.6, 0.0)) * box( p, vec3(0.1, 0.7, 0.0)));
}

vec3 map( vec3 o, vec3 r )
{
	vec3 finalColor = vec3( 0.5 );
	
	float minT = scene( o );
	
	for( int i = 0; i < 32; ++i )
	{
		o = o + r;
		
		minT = min( minT, scene(o) );
		
		if( minT <= 0.001 )
		{
			finalColor = vec3( 1. );
			break;
		}
		else if( minT > 10000.0 )
		{
			break;
		}
	}
	
	return finalColor;	
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	
	float theta = time * 2.0;
	float co = cos( theta );
	float si = sin(theta);
	uv *= mat2( co, -si, si, co );
	
	vec3 o = vec3( 0.0, 0.0, -5.0 );
	vec3 r = vec3(uv.x, uv.y, 1.0);
	
	vec3 finalColor = map( o, r );

	gl_FragColor = vec4( finalColor, 1.0 );

}