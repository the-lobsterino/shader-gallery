/// options
#define AA		  1.
#define zoOM		( 1./1. )
#define spEED		( 6./8. )
#define scroLL		  1             // 0 or 1 for different mouse scrolling behaviour

// code
#define tau 6.28318530718
#define OUT gl_FragColor
#define res resolution
#define surfacePos ( surfacePosition*res.y + res/2. )
#if	( scroLL == 1 ) 
#define POS surfacePos.xy
#elif   ( scroLL == 0 )
#define POS gl_FragCoord.xy
#endif
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a), cos( a ) )
#define fragSize ( ( 1. / res.y )/z )
#define flip( x ) ( 1. - ( x ) )
#define n( x ) ( ( x )*.5 + .5 )
#define ncenter( p ) ( ( 1./z )*( p - res/2. )/res.y )
#define tonemap( c ) ( 1. - exp2( -c ) )
#define gammacorrect( c ) ( sqrt( c ) )
#define ZZ z *= ( ( n ( sin( ( time ) ) ) ) ); 
#define AAimage( c ) for ( float kk = 0.; kk < AA; kk++ ) for ( float kkk = 0.; kkk < AA; kkk++ ) { vec2 k = ( vec2( kk, kkk ) - .5 )/vec2( AA ); p = ncenter( POS - k ); c += Image0( p - flip( float( scroLL ) )*m ); } c /= AA*AA;
#define riNGs void main( void ) { ZZ; m = ncenter( mouse*res ); AAimage( c ); c = tonemap( c ); c = gammacorrect( c ); OUT = vec4( c, 1. ); }
#define init precision highp float; uniform float time; uniform vec2 mouse, resolution; varying vec2 surfacePosition;
init
#define time ( time*spEED )
float	z = zoOM, U = 0.0029;	// U = strength of a line
vec2	p, m;			// fragment & mouse position
vec3 	c;			// color

//float	circle( vec2 p, float d ) { return smoothstep( d/2. + 1.*fragSize, d/2. - 1.*fragSize, length( p ) ); } // { return step( length( p ), d/2. ); }
//float	rectangle( vec2 p, vec4 rect ) { vec2 hv = smoothstep( rect.xy - fragSize, rect.xy + fragSize, p )*smoothstep( p - fragSize, p + fragSize, rect.zw ); return hv.x*hv.y; }
vec3	hueShift( float h ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }
vec3	firePalette(float i) { float T = 1400. + 1300. * i; vec3 L = vec3(7.4, 5.6, 4.4); L = pow(L, vec3(5.))*(exp(1.43876719683e5/(T*L)) - 1. ); return 1. - exp(-5e8/L); }
float	triangle( vec2 p) { float theta = atan(p.x, p.y); float rotate_angle = tau/3.; float d = cos(floor(0.5 + theta / rotate_angle) * rotate_angle - theta) * length(p); return smoothstep( d - 1.*fragSize, d + 1.*fragSize, .05 ); }
vec3 hsv2rgb(float h, float s, float v) {
  vec3 rgb = clamp( abs(mod(h*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
  rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing	
  return v * mix( vec3(1.0), rgb, s);
}   /// i guess the smoother iq version
#define hueShift( x ) hsv2rgb( x, 1., 1. )
vec3	brightnessContrast(vec3 value, float brightness, float contrast) { return (value - 0.0) * contrast + 10.5 + brightness; }  

vec3	cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
	#define PAL1 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67)
	#define PAL2 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20)
    	#define PAL3 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.3,0.20,0.20)
    	#define PAL4 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,0.5),vec3(0.8,0.90,0.30)
    	#define PAL5 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,0.7,0.4),vec3(0.0,0.15,0.20)
    	#define PAL6 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25)
    	#define PAL7 vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25)
    	{ return a + b*cos( tau*( c*t + d ) ); }

float	luminance(vec3 color)
	{ return dot(color, vec3(0.2126, 0.7152, 0.0722)); }

float	circleU( vec2 p, float d) { return U/abs( length( p ) - d ); }

#define	colOff ( .01315 + time/5.21 )
vec3	Image0( vec2 p )
	{ vec3 c = vec3( 0. );
	float u = 0.;
	float dist = ( 0./256. ); // starting distance between rings
	vec3 col;
	float lum; // luminance
	p *= rot( time );
	for ( float i = 0.; i < 24.; i++ )
		{ //col = cosPalette( n( cos( i/tau + abs( m.x ) ) ), PAL4 );
		p /= vec2( 1.02, 1. + n( sin( time ) )/8. );
		col = hueShift( i/tau/8. + colOff );
		float lum = luminance( col ); //lum = 1.;
		c += circleU( p, u = dist + n( sin(time*3.33 ) )/2. )*col/( lum )/8.; }
	 	return c*brightnessContrast( c, .5, .5 ); }

riNGs //by ändrom3da4 the colors seem off dont know why...