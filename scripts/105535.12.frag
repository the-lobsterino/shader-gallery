#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = acos(-1.0);
const float tau = 2.*PI;

vec3	cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
	#define PAL1 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67)
	#define PAL2 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20)
    	#define PAL3 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.3,0.20,0.20)
    	#define PAL4 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,0.5),vec3(0.8,0.90,0.30)
    	#define PAL5 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,0.7,0.4),vec3(0.0,0.15,0.20)
    	#define PAL6 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25)
    	#define PAL7 vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25)
    	{ return a + b*cos( tau*( c*t + d ) ); }

vec3	hueShift( float h ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }

vec3 hsv2rgb(float h, float s, float v) {
  vec3 rgb = clamp( abs(mod(h*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
  rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing	
  return v * mix( vec3(1.0), rgb, s);
}
#define saturate( x ) ( clamp( x, 0., 1. ) )
vec3 hue23rgb(float hue){
	hue=fract(hue);
	return saturate(vec3(
		abs(hue*6.-3.)-1.,
		2.-abs(hue*6.-2.),
		2.-abs(hue*6.-4.)
	));
}

float	luminance(vec3 color)
	{ return dot(color, vec3(0.2126, 0.7152, 0.0722)); }

#define hueShiftt( x ) hsv2rgb( x, 1., 1. )
#define hueShifttt( x ) hue23rgb( x )
#define n( x ) ( ( x )*.5 +.5 )
vec3 RGBtoRYB(vec3 rgb){
	return vec3(0,0,0)*(1.0-rgb.r)*(1.0-rgb.g)*(1.0-rgb.b) +
	       vec3(0,0,1)*(1.0-rgb.r)*(1.0-rgb.g)*rgb.b +
	       vec3(0,1,0)*(1.0-rgb.r)*rgb.g*(1.0-rgb.b) +
	       vec3(1,0,0)*rgb.r*(1.0-rgb.g)*(1.0-rgb.b) +
	       vec3(0,1,1)*(1.0-rgb.r)*rgb.g*rgb.b +
	       vec3(1,0,1)*rgb.r*(1.0-rgb.g)*rgb.b +
	       vec3(1,1,0)*rgb.r*rgb.g*(1.0-rgb.b) +
	       vec3(1,1,1)*rgb.r*rgb.g*rgb.b;   // wtf
}
#define p position
#define p2x ( position.x/2. )
#define ratio .5                                                   // <<<<<<<<<<<<< for testing
#define flip( x ) ( 1. - ( x ) )
#define c color
#define gamma 1.8
void main( void ) {

	vec2 position = 2.*gl_FragCoord.xy / resolution.xy;

	vec3 color = vec3(0.0);
	     color = n( cos((-position.x-0.7) * 3.15 + vec3(PI, 1.5*PI, tau))); //color = pow( color, vec3( 3.*clamp( mouse.y, 0.5, 1. ) ) );
	vec3 cc = color;     
	//color = RGBtoRYB(color);
//color = sqrt( color );
if ( position.y > 1.33) { color = hueShiftt( position.x/2.  ); color = pow( color, vec3( 1./gamma ) );
			#if 1
			 color = ( flip( ratio )*cc*p2x*2. + ratio*color*flip( p2x )*2. );
			 //color = ( flip( ratio )*cc + ratio*color );
			 
			#endif 
			} 
	if( position.y > .66 && position.y < 1.33 ) color = cosPalette( (-position.x-2.1)/2.15, PAL1 );

	gl_FragColor = vec4(color, 1.0 );

}