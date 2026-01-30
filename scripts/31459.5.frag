//author : Jelo Wang
//Quantum Dynamics Lab.

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand ( vec2 p ) 
{
	return fract( sin( dot(p, vec2( 32.79, 25.93  ) ) ) ) ;
}

float valueNoise ( vec2 p )
{
	vec2 i = floor (p) ;
	vec2 f = fract (p) ;
	
	//smooth Hermite Curve
	f = f*f*(3.0-2.0*f) ;
	
	//bilinear interpolation of the value
	float buttomValue = mix (  rand ( vec2(i + vec2(0.0,0.0) ) ) , rand ( vec2(i + vec2(1.0,0.0)) ) , f.x ) ;
	float topValue = mix (  rand ( vec2(i + vec2(0.0,1.0) ) ) , rand ( vec2(i + vec2(1.0,1.0)) ) , f.x ) ; 
	float value = mix ( buttomValue , topValue , f.y ) ;
	
	return value ;
}

//compose multi layers
float fbm ( vec2 p )
{
	float sum = 0.0 ;
	float freq = 2.0 ;
	float amp = 0.5 ;
	
	for ( int walker = 0 ; walker < 3 ; walker ++ ) {
		sum = sum + valueNoise ( p * freq ) * amp ;
		freq = freq * 2.0 ;
		amp = amp * 0.8 ;
	}
	
	return sum ;
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy ;
	uv.xy = -1.0 + 2.0 * uv.xy ;
	uv.x = uv.x * resolution.y / resolution.x ;
	
	gl_FragColor = vec4( vec3(fbm(uv)) , 1.0 );
	
}