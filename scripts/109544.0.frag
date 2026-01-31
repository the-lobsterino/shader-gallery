       //\
      // \\
     //   \\
    //     \\
   //   A   \\
  //         \\
 // ändrom3da \\
//_____________\\


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
#define rot(a)               mat2(cos(TAU*a),-sin(TAU*a),sin(TAU*a),cos(TAU*a))


 // program options  //
//  =============== //

#define SPEED                0.5
#define ZOOM                 1.0
//#define GAMMA_CORRECTION   1.0
//#define DITHERING          1          // 0 or uncomment = OFF, 1 = ON
//#define BACKBUFFER         2.67       // uncomment for OFF, otherwise use 0.1 to 5.0
#define TIMEWAVE             1.0
#define RECTANGLE            1


// pre-program  //
// =========== //

#define time                 time * SPEED
float tw = tw(TIMEWAVE);  // defining tw as timewave with wavelength of the constant TIMEWAVE


 // geometry  //
//  ======== //

float rectangle(vec2 p, vec2 size)
{
	vec2 halfsize = size/1.;
	float r = step(-halfsize.x, p.x) * step(-halfsize.y, p.y) *
		  step(p.x, halfsize.x)  * step(p.y, halfsize.y);
	return r;
}

float rectangleUI(vec2 p1, vec2 size)
{
	vec2 halfsize = size/2.;
	float r = step(0., p1.x) * step(0., p1.y) *
		  step(p1.x, size.x)  * step(p1.y, size.y);
	return r;
}

float rectanglePoly(vec2 p, vec2 p2, vec2 size)
	{
		p2=p;
		p = mod(p, 0.75 *tw);
			vec2 halfsize = size/1.;
			float r = step(-halfsize.x, p.x) * step(-halfsize.y, p.y) *
			  
				  step(p.x, halfsize.x)  * step(p.y, halfsize.y);
		return r * rectangle(p2, vec2(0.5, 0.5)+tw*0.2);
		}

float thing(vec2 p, float r)   // whateva this is...
{
	float t = atan(p.y/time*tw, p.x/time*tw);
	float o = step(length(p), r + 0.2);
	return o;
}

float circle(vec2 p, float r)
{
	float o = step(length(p), r);
	return o;
}


 // coloration  //
//  ========== //

vec3 hsv2rgb( vec3 c )
{
  vec4 K = vec4( 1.0, 2.0/3.0, 1.0/3.0, 3.0 );
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

vec3 simplePalette( float t, vec3 color1, vec3 color2 )
{
	vec3 c = vec3(1.0);
        /*
        c = vec3(
		(1./1.)*t,
		(1./1.)*t,
		(1./1.)*t
		);
        */
	c *= mix( color1, color2, t );
	return c;
}

 // UI stuff  //
//  ======== //

vec3 userInterface(vec2 p1)
{
	vec3 o = vec3(0.0);
	#ifdef RECTANGLE
	#if (RECTANGLE == 1)
	vec2 rectPos   = vec2(0.0, 0.0);
	vec2 rectSize  = vec2(1.0, 0.045);
	p1 -= rectPos;
	o  += rectangleUI(p1, rectSize) * step( p1.y, 0.05 );;
	//o  *= simplePalette( p1.x );
	//o  *= cosPalette( p1.x, vec3(0.5,0.5,0.5), vec3(0.5,0.5,0.5), vec3(1.0,1.0,1.0), vec3(0.0,0.33,0.67) );
	//o *= cosPalette( p1.x, PAL1 );
	o *= simplePalette(p1.x, vec3(11.0), vec3(1.0));

        p1 += rectPos;
	#endif
        #endif
	return o;
}


 // the scene  //
//  ========= //

vec3 scene(vec2 p, vec2 p1)
{
	p *= rot(time);
	vec3 o  = rectanglePoly(p, p, vec2(88.15, 0.15) ) * cosPalette( p1.x, PAL4 );
	return o;
}



 // the program  //
//  =========== //

void main(void)
{
	// fragment
	vec2 p  = 1./ZOOM * (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);  // centered
	vec2 p0 = gl_FragCoord.xy / resolution.xy;                                                // not centered for backbuffer
	vec2 p1 = gl_FragCoord.xy / resolution.xy; p1.y = 1.0 - p1.y;                             // not centered top to bottom for UI stuff
	vec3 c = vec3(0.0, 0.0, 0.0);  // color variable for each fragment with alpha channel

        // the scene
        c += scene(p, p);
	
	// user interface
	c += userInterface(p1);
	
	// dithering
	#ifdef DITHERING
	#if (DITHERING == 1)
	c += floor(p.y - fract(dot(gl_FragCoord.xy, vec2(0.4, 0.8))) * 10.0) * 0.05;  // strange dithering effect
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