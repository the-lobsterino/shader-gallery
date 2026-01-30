// massive gash
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

float cust_rand(vec2 co){
    return fract(sin(dot(co ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 cust_rand_2(vec2 co){
    return vec2(cust_rand(co), cust_rand(co + vec2(0.23)) );
}

vec2 voronoi( vec2 p )
{
	
	vec2 grid_point = floor( p );
	vec2 distance_from_middle = fract(p);
	
	float t = 2.0;
	
	vec2 result;
	
	
	float minDistance = 100000.0;
	
	for( int y = -1; y <= 1; ++y )
	{
		for( int x = -1; x <= 1; ++x )
		{
						
			vec2 lattice = vec2( x, y );
			vec2 offset = cust_rand_2(lattice + grid_point);
			
			//float d = distance( lattice + vec2((sin( time * offset) * 0.5 + 0.5) ), f);
			float d = distance(lattice + offset, distance_from_middle);
			
			if( d < minDistance )
			{	
				minDistance = d;
				result = offset;
			}
			
			result = offset;
			
		}
	}
	
	
	return result;
}

vec2 test(vec2 p){
	vec2 grid_point = floor( p );
	vec2 distance_from_middle = fract(p);
	
	return cust_rand_2(grid_point);
}

void main( void ) {

	float zoom = 0.3;
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;

	uv.x *= resolution.x / resolution.y;
	uv.x = dot(uv,uv)+time;
	vec2 c = test( uv / zoom );
	//vec3 finalColor = cos(c.x * 10.23 + vec3( 1.0, 2.0, 3.0)) * 0.5 + 0.5;
	vec3 finalColor = vec3(c, 0.5);
	gl_FragColor = vec4( finalColor, 1.0 );

}