// Voronoi
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

vec2 randomVec2( vec2 p )
{
	mat2 m = mat2( 15.27, 47.63,
		       99.41, 88.98 );
	
	return fract( sin(m * p) * 46839.32 );
}

vec3 voronoi( vec2 p )
{
	
	vec2 g = floor( p );
	vec2 f = fract(p);
	
	float t = 8.0;
	
	vec3 closestLattice = vec3(8.0,8.0,8.0);
	
	for( int y = -1; y <= 1; ++y )
	{
		for( int x = -1; x <= 1; ++x )
		{
			vec2 lattice = vec2( x, y );
			float d = distance( lattice + randomVec2(lattice + g), f);
			
			if( d < closestLattice.x )
			{
				closestLattice.z = closestLattice.y;
				closestLattice.y = closestLattice.x;
				closestLattice.x = d;
			}
			else if( d < closestLattice.y )
			{
				closestLattice.z = closestLattice.y;
				closestLattice.y = d;
			}
			else if( d < closestLattice.z )
			{
				closestLattice.z = d;
			}
		}
	}
	
	
	float z = closestLattice.x / closestLattice.y;
	
	vec3 finalColor = vec3( 1.0-z );
	
	return finalColor;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;

	vec3 finalColor = voronoi( uv * 10.0 );

	gl_FragColor = vec4( finalColor, 1.0 );

}