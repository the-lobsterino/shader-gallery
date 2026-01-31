/// options
#define AA		  4.
#define zoOM		( 10./1. )
#define gamma		  1.5
#define spEED		( 1./1. )

// code
#define tau 6.28318530718
#define POS gl_FragCoord.xy
#define OUT gl_FragColor
#define res resolution
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a), cos( a ) )
#define n( x ) ( ( x )*.5 + .5 )
#define ncenter( p ) ( ( 1./zoOM )*( p - res/2. )/res.y )
#define tonemap( c ) ( 1. - exp( -c ) )
#define gammacorrect( c ) ( pow( c, vec3( gamma ) ) )
precision highp float;
uniform float time;
uniform vec2 mouse, resolution;	// uniform variables
vec2	m;			// fragment & mouse position
vec3 	c;			// color
float	circle( vec2 p, float r ) { return step( length( p ), r ); }
vec3	hueShift( float h )
	{ vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }

vec3 firePalette(float i) { float T = 1400. + 1300. * i; vec3 L = vec3(7.4, 5.6, 4.4); L = pow(L, vec3(5.))*(exp(1.43876719683e5/(T*L)) - 1. ); return 1. - exp(-5e8/L); }

vec4 Image0( vec2 p, float t ) {
	p *= 0.1;
	p -= m;
	p = (p-vec2(4.,1.25))/4.;
	vec3 color = vec3(0.);
	vec2 c = vec2(0.);
	const float count = 256.;
	float stepratio = 1.;

	for (float i=0.; i<count; i++)
	{
		c = vec2(c.x*c.x-c.y*c.y, 2.*c.x*c.y) + p;

		if (length(c) > 4.)
		{
			stepratio = i/count;
			break;
		}
	}
	
	float len = length(c);
	
	if(len < 1.0) {
		return vec4(0.0);
	}
	
	float coef = 0.0;
	
	if(1.0 - 1.0 / len > 0.91 || len < 4.6) {
		coef += 1.0;
	}
	
	for(int i = 0; i < 4; i++) {
		color += firePalette(cos( stepratio*32.+4.*(t + float(i) / 16.) ));
	}
	
	color /= 2.;

	return vec4(color, coef);
}

vec2 screen2uv(vec2 px) {
	return (px - resolution.xy * 0.5) / min(resolution.x, resolution.y);
}

void main( void ) {
	vec2 p = gl_FragCoord.xy;
	
	m = ncenter( mouse*res );
	int iter = 0;
	
	vec4 im = Image0( screen2uv(p), time * 0.3 + p.y * 0.0 );
	
	if(im.a < 0.5) {
		c = im.rgb;
	} else {
		for ( float x = 0.; x < AA; x++ ) {
			for ( float y = 0.; y < AA; y++ ) {
				vec4 im = Image0(screen2uv(p + vec2(x, y) / AA - 0.5), time * 0.3 + p.y * 0.0 );
				c += im.rgb;
			}
		}

		c /= AA * AA;
	}

	c = tonemap( c );
	c = gammacorrect( c );
	OUT = vec4( c, 1. );
} ////ändrom3da4