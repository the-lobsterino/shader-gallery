#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float M_PI = 3.141592;
vec3 colormap( float x )
{
	/*
	vec3 factor = vec3(
		clamp( cos( (x-0.25)*M_PI/0.3 ), 0.0, 1.0 ),
		clamp( cos( (x-0.50)*M_PI/0.6 ), 0.0, 1.0 ),
		clamp( cos( (x-0.75)*M_PI/0.7 ), 0.0, 1.0 )
	);
	return factor;
*/
	return vec3(x);
}

// z_{n+1} = (z_n)^2 + c
vec2 iterate( vec2 z, vec2 c )
{
	vec2 z2 = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y );
	return z2 + c;
}

float threshold_sq = 4.0;
const int MAXIT = 100;
// return iteration count
int mandelbrot_iterate( vec2 c )
{
	vec2 z = vec2(0.0);
	for( int it=0; it<MAXIT; ++it )
	{
		if( dot(z,z) > threshold_sq ){ return it; }
		z = iterate( z, c );
	}
	return MAXIT;
}


void main( void ) {
	vec2 scale_factor = vec2( 4.0 );
	vec2 position = (( gl_FragCoord.xy / resolution.xy )-vec2(0.5))*scale_factor;
	int i = mandelbrot_iterate( position );

	gl_FragColor = vec4( colormap(float(i)/float(MAXIT)), 1.0);

}