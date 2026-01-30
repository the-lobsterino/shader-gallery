
#extension GL_OES_standard_derivatives : enable
precision highp float;


  // uniforms  //
 //  ======== //

uniform float      time;
uniform vec2       resolution;
uniform vec2       mouse;
uniform sampler2D  bb;                 // the backbuffer
varying vec2       surfacePosition;


 // pre-processor makros  //
//  ==================== //

#define TAU                  6.2831853071
#define PI                   TAU / 2.
#define tw(a)                sin(a*time)*0.5 + 0.5
#define rot(a)               mat2( cos(TAU*a), -sin(TAU*a), sin(TAU*a), cos(TAU*a) )
#define SOMESMALLVALUE       0.0000001


 // program options  //
//  =============== //

#define SPEED                2.5
#define ZOOM                 0.025
//#define GAMMA_CORRECTION   1.0
//#define DITHERING          1          // 0 or uncomment = OFF, 1 = ON
#define BACKBUFFER           0.4       // uncomment for OFF, otherwise use 0.1 to 5.0
#define TIMEWAVE             1.0
#define RECTANGLE            1
#define ROTATION	     0.1

// pre-program  //
// =========== //

#define time                 time*SPEED
float tw = tw(TIMEWAVE);  // defining tw as timewave with length of the constant TIMEWAVE


 // coloration  //
//  ========== //

vec3 hsv2rgb( vec3 c )
{
  vec4 K = vec4( 1.0, (2.0/3.0), (1.0/3.0), 3.0 );
  vec3 p = abs( fract( c.xxx + K.xyz )*6.0 - K.www );
  return c.z * mix( K.xxx, clamp( p - K.xxx, 0.0, 1.0 ), c.y );
}

vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    // from https://www.shadertoy.com/view/ll2GD3 palette shadertoy from iq:
    #define PAL1 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67)
    #define PAL2 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20)
    #define PAL3 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.3,0.20,0.20)
    #define PAL4 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,0.5),vec3(0.8,0.90,0.30)
    #define PAL5 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,0.7,0.4),vec3(0.0,0.15,0.20)
    #define PAL6 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25)
    #define PAL7 vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25)
    return a + b*cos( TAU*( c*t + d ) );
}

vec3 graphicalInterface( vec2 p1, vec3 c )
{
        vec3 o = vec3(1.0);
	#ifdef RECTANGLE
	#if (RECTANGLE == 1)
	const float  border  =  0.002;
        const vec3   white   =  vec3(1.0);
	const vec3   black   =  vec3(0.0);
	vec2 rectPos         =  vec2(0.0, 0.0);
	vec2 rectSize        =  vec2(1.0, 0.045);
	//p1 -= rectPos;
	//o *= dualPalette( p1.x, black, white );
	
	vec3 m1 = vec3( +2.0, +1.5, -0.6 );
	vec3 m2 = vec3( -4.0, +3.0, -1.3 );
	vec3 m3 = vec3( -4.0, +3.0, -1.0 );
	o *= cosPalette( p1.x + 0.5*time, PAL1 );
        p1 += rectPos;
	return (o - c) * step( p1.y - border, rectSize.y + rectPos.y );  // minus c because the scene should not be over
	#endif
        #endif
	#ifndef RECTANGLE
	return 0.;
	#endif
}

 // the program  //
//  =========== //

void main(void)
{
	// fragment
	vec2 p0 = gl_FragCoord.xy / resolution.xy;                                                   // not centered for backbuffer
	vec2 p1 = gl_FragCoord.xy / resolution.xy; p1.y = 1.0 - p1.y;                                // not centered top to bottom for UI stuff
	vec3 c = vec3(0.0, 0.0, 0.0);  // color variable for each fragment with alpha channel
	
	// user interface
	c += graphicalInterface(p1, c);
	
	// dithering
	#ifdef DITHERING
	#if (DITHERING == 1)
	c += floor(p.y - fract(dot(gl_FragCoord.xy, vec2(0.4, 0.8))) * 100.0) * 0.05;  // strange dithering effect
	#endif
	#endif
	
	// backbuffer "smoothing"
	#ifdef BACKBUFFER
	float value = (2./BACKBUFFER) * 0.15;
	c = (1.00 - value)*texture2D(bb, p0).xyz + value*c;
	c *= 1.00;   // you can tweak that output...
	#endif
	
	// gamma correction
	#ifdef GAMMA_CORRECTION
	c = pow(c.rgb, vec3(1.0/GAMMA_CORRECTION));
	#endif
	
	// the final fragment
	gl_FragColor = vec4(c, 1.0);
}