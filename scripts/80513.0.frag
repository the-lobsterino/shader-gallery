#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//
//	implementation of the blumblumshub hash
//	as described in MNoise paper http://www.cs.umbc.edu/~olano/papers/mNoise.pdf
//
//	http://briansharpe.wordpress.com/2011/10/01/gpu-texture-free-noise/
//
vec4 BBS_coord_prepare(vec4 x) { return x - floor(x * ( 1.0 / 61.0 )) * 61.0; }
vec3 BBS_coord_prepare(vec3 x) { return x - floor(x * ( 1.0 / 61.0 )) * 61.0; }
vec4 BBS_permute(vec4 x) { return fract( x * x * ( 1.0 / 61.0 )) * 61.0; }
vec4 BBS_permute_and_resolve(vec4 x) { return fract( x * x * ( 1.0 / 61.0 ) ); }
vec4 BBS_hash_2D( vec2 gridcell )	//	generates a random number for each of the 4 cell corners
{
    //    gridcell is assumed to be an integer coordinate
    vec4 hash_coord = BBS_coord_prepare( vec4( gridcell.xy, gridcell.xy + 1.0 ) );
    vec4 p = BBS_permute( hash_coord.xzxz /* * 7.0 */ ); // * 7.0 will increase variance close to origin
    return BBS_permute_and_resolve( p + hash_coord.yyww );
}
vec4 BBS_hash_hq_2D( vec2 gridcell )	//	generates a hq random number for each of the 4 cell corners
{
    //    gridcell is assumed to be an integer coordinate
    vec4 hash_coord = BBS_coord_prepare( vec4( gridcell.xy, gridcell.xy + 1.0 ) );
    vec4 p = BBS_permute( hash_coord.xzxz /* * 7.0 */ );  // * 7.0 will increase variance close to origin
    p = BBS_permute( p + hash_coord.yyww );
    return BBS_permute_and_resolve( p + hash_coord.xzxz );
}
vec2 Interpolation_C2( vec2 x ) { return x; }

float Value2D( vec2 P )
{
    //	establish our grid cell and unit position
    vec2 Pi = floor(P);
    vec2 Pf = P - Pi;

    //	calculate the hash.
    //	( various hashing methods listed in order of speed )
    //vec4 hash = FAST32_hash_2D( Pi );
    //vec4 hash = FAST32_2_hash_2D( Pi );
    vec4 hash = BBS_hash_hq_2D( Pi );
    //vec4 hash = SGPP_hash_2D( Pi );
    //vec4 hash = BBS_hash_hq_2D( Pi );

    //	blend the results and return
    vec2 blend = Interpolation_C2( Pf );
    vec4 blend2 = vec4( blend, vec2( 1.0 - blend ) );
    return dot( hash, blend2.zxzx * blend2.wwyy );
}

void main( void ) {

	vec2 position = gl_FragCoord.xy;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3(Value2D(position/5.0)), 1.0 );

}