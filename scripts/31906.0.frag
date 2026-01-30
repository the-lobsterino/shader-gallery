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
	
	return fract( sin(m * p) * 4689.32 );
}

float voronoi( vec2 p )
{
	
	vec2 g = floor( p );
	g += randomVec2(g)*sin(time*0.01)*0.0001;
	vec2 f = fract(p);
	
	float res = 8.0;
	
	for( int y = -1; y <= 1; ++y )
	{
		for( int x = -1; x <= 1; ++x )
		{
			vec2 lattice = vec2( x, y )* randomVec2(g) - f;
			float d = 1.-dot(lattice,lattice);
			res = min( d*d, res );
		}
	}
	
	res = sqrt(res);
	
	return 1.0-pow(res,10.0*sin(res*6.28+(2.0*sin(time)-1.5)));
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;

	vec3 finalColor = vec3( 0.0, 1.-pow( voronoi( uv * 5.4 ), 11.14 ), 0.0 );

	gl_FragColor = vec4( finalColor, 1.0 );

}