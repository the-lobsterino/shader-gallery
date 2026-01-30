#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//https://github.com/BrianSharpe/GPU-Noise-Lib/blob/master/gpu_noise_lib.glsl
vec4 SGPP_coord_prepare(vec4 x) { return x - floor(x * ( 1.0 / 289.0 )) * 289.0; }
vec3 SGPP_coord_prepare(vec3 x) { return x - floor(x * ( 1.0 / 289.0 )) * 289.0; }
vec4 SGPP_permute(vec4 x) { return fract( x * ( ( 34.0 / 289.0 ) * x + ( 1.0 / 289.0 ) ) ) * 289.0; }
vec4 SGPP_resolve(vec4 x) { return fract( x * ( 7.0 / 288.0 ) ); }

void FAST32_hash_2D( vec2 gridcell, out vec4 hash_0, out vec4 hash_1 )	//	generates 2 random numbers for each of the 4 cell corners
{
    //    gridcell is assumed to be an integer coordinate
    const vec2 OFFSET = vec2( 26.0, 161.0 );
    const float DOMAIN = 71.0;
    const vec2 SOMELARGEFLOATS = vec2( 951.135664, 642.949883 );
    vec4 P = vec4( gridcell.xy, gridcell.xy + 1.0 );
    P = P - floor(P * ( 1.0 / DOMAIN )) * DOMAIN;
    P += OFFSET.xyxy;
    P *= P;
    P = P.xzxz * P.yyww;
    hash_0 = fract( P * ( 1.0 / SOMELARGEFLOATS.x ) );
    hash_1 = fract( P * ( 1.0 / SOMELARGEFLOATS.y ) );
}
float Interpolation_C2( float x ) { return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }   //  6x^5-15x^4+10x^3	( Quintic Curve.  As used by Perlin in Improved Noise.  http://mrl.nyu.edu/~perlin/paper445.pdf )
vec2 Interpolation_C2( vec2 x ) { return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
vec3 Interpolation_C2( vec3 x ) { return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
vec4 Interpolation_C2( vec4 x ) { return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
vec4 Interpolation_C2_InterpAndDeriv( vec2 x ) { return x.xyxy * x.xyxy * ( x.xyxy * ( x.xyxy * ( x.xyxy * vec2( 6.0, 0.0 ).xxyy + vec2( -15.0, 30.0 ).xxyy ) + vec2( 10.0, -60.0 ).xxyy ) + vec2( 0.0, 30.0 ).xxyy ); }
vec3 Interpolation_C2_Deriv( vec3 x ) { return x * x * (x * (x * 30.0 - 60.0) + 30.0); }

float Interpolation_C2_Fast( float x ) { float x3 = x*x*x; return ( 7.0 + ( x3 - 7.0 ) * x ) * x3; }   //  7x^3-7x^4+x^7   ( Faster than Perlin Quintic.  Not quite as good shape. )
vec2 Interpolation_C2_Fast( vec2 x ) { vec2 x3 = x*x*x; return ( 7.0 + ( x3 - 7.0 ) * x ) * x3; }
vec3 Interpolation_C2_Fast( vec3 x ) { vec3 x3 = x*x*x; return ( 7.0 + ( x3 - 7.0 ) * x ) * x3; }
vec4 Interpolation_C2_Fast( vec4 x ) { vec4 x3 = x*x*x; return ( 7.0 + ( x3 - 7.0 ) * x ) * x3; }
float Perlin2D( vec2 P )
{
    //	establish our grid cell and unit position
    vec2 Pi = floor(P);
    vec4 Pf_Pfmin1 = P.xyxy - vec4( Pi, Pi + 1.0 );

#if 1
    //
    //	classic noise looks much better than improved noise in 2D, and with an efficent hash function runs at about the same speed.
    //	requires 2 random numbers per point.
    //

    //	calculate the hash.
    //	( various hashing methods listed in order of speed )
    vec4 hash_x, hash_y;
    FAST32_hash_2D( Pi, hash_x, hash_y );
    //SGPP_hash_2D( Pi, hash_x, hash_y );

    //	calculate the gradient results
    vec4 grad_x = hash_x - 0.49999;
    vec4 grad_y = hash_y - 0.49999;
    vec4 grad_results = inversesqrt( grad_x * grad_x + grad_y * grad_y ) * ( grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww );

#if 1
    //	Classic Perlin Interpolation
    grad_results *= 1.4142135623730950488016887242097;		//	(optionally) scale things to a strict -1.0->1.0 range    *= 1.0/sqrt(0.5)
    vec2 blend = Interpolation_C2( Pf_Pfmin1.xy );
    vec4 blend2 = vec4( blend, vec2( 1.0 - blend ) );
    return dot( grad_results, blend2.zxzx * blend2.wwyy );
#else
    //	Classic Perlin Surflet
    //	http://briansharpe.wordpress.com/2012/03/09/modifications-to-classic-perlin-noise/
    grad_results *= 2.3703703703703703703703703703704;		//	(optionally) scale things to a strict -1.0->1.0 range    *= 1.0/cube(0.75)
    vec4 vecs_len_sq = Pf_Pfmin1 * Pf_Pfmin1;
    vecs_len_sq = vecs_len_sq.xzxz + vecs_len_sq.yyww;
    return dot( Falloff_Xsq_C2( min( vec4( 1.0 ), vecs_len_sq ) ), grad_results );
#endif

#else
    //
    //	2D improved perlin noise.
    //	requires 1 random value per point.
    //	does not look as good as classic in 2D due to only a small number of possible cell types.  But can run a lot faster than classic perlin noise if the hash function is slow
    //
    //	calculate the hash.
    //	( various hashing methods listed in order of speed )
    vec4 hash = FAST32_hash_2D( Pi );
    //vec4 hash = BBS_hash_2D( Pi );
    //vec4 hash = SGPP_hash_2D( Pi );
    //vec4 hash = BBS_hash_hq_2D( Pi );
    //
    //	evaulate the gradients
    //	choose between the 4 diagonal gradients.  ( slightly slower than choosing the axis gradients, but shows less grid artifacts )
    //	NOTE:  diagonals give us a nice strict -1.0->1.0 range without additional scaling
    //	[1.0,1.0] [-1.0,1.0] [1.0,-1.0] [-1.0,-1.0]
    //
    hash -= 0.5;
    vec4 grad_results = Pf_Pfmin1.xzxz * sign( hash ) + Pf_Pfmin1.yyww * sign( abs( hash ) - 0.25 );
    //	blend the results and return
    vec2 blend = Interpolation_C2( Pf_Pfmin1.xy );
    vec4 blend2 = vec4( blend, vec2( 1.0 - blend ) );
    return dot( grad_results, blend2.zxzx * blend2.wwyy );
#endif

}
void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	float color = pow(Perlin2D(p*100.0 + time*1.5 + time*0.1*sin(time)), 1.5);
	//color = FAST32_2_hash_2D(p*10.0).x;
	gl_FragColor = vec4( vec3( 0, color, color*0.5), 1.0 );
}