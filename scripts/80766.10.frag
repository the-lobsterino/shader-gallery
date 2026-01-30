       //\
      // \\
     //   \\
    //     \\
   //       \\
  //    A    \\
 // ändrom3da \\
//_____________\\


#extension GL_OES_standard_derivatives : enable
precision mediump float;

 // uniforms //
// ======== //

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform sampler2D bb; // the backbuffer
varying vec2 surfacePosition;


 // pre-processor makros  //
//  ==================== //

#define TAU 6.2831853071
#define time time * 3.6
#define tw(a) sin(a*time)*0.5 + 0.5

#define abc TAU
#define rot(a) mat2(cos(abc*a),-sin(abc*a),sin(abc*a),cos(abc*a))

#define mask0 vec3(1.0, 1.0, 1.0);
#define mask1 vec3(0.5, 0.6, 0.7);

#define ZOOM        2.0
//#define DITHERING   1       // 0 = OFF, 1 = ON
#define BACKBUFFER  3.0     // uncomment for OFF
#define TIMEWAVE    1.0
#define RECTANGLE   0


// pre-program  //
// =========== //

float tw = tw(TIMEWAVE);  // defining tw as timewave with length 1.0


 // geometry  //
//  ======== //

float rectangle(vec2 p, vec2 size)
{
	vec2 halfsize = size/2.;
	float r = step(-halfsize.x, p.x) * step(-halfsize.y, p.y) *
		  step(p.x, halfsize.x)  * step(p.y, halfsize.y);
	          //step(halfsize.x, p.x)  * step(halfsize.y, p.y);
	return r;
}

float thing(vec2 p, float r)
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

vec3 palette(float v)
{
        #define blue       vec3(0.1, 0.2, 0.9)
	#define turquoise  vec3(0.9, 0.6, 0.0)
	vec3 c;
        c = vec3(
		(1./1.)*v,
		(1./1.)*v,
		(1./1.)*v
		);
	c = mix(blue, turquoise, v);
	return c;
}


 // the program  //
//  =========== //

void main(void)
{
	// the fragments
	vec2 p = ZOOM *(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 c = vec3(0.0);  // the color variable
	
	// ...
	//p.x -= 25.*time;
	
	// this is needed for the backbuffer stuff
	#ifdef BACKBUFFER
	vec2 p0 = gl_FragCoord.xy / resolution.xy;
	#endif
	

	// the stuff
	vec2 size = vec2(3.0, 0.2);
	vec2 halfsize = size/2.;
	vec2 position;
	
	#if (RECTANGLE == 1)
	position = vec2(0.0, 0.5);
	c = vec3(1.0);
	p -= position;
	c *= rectangle(p, size);
	c *= palette((p.x+halfsize.x)/size.x);
        p += position;
	#endif
       
	p *= rot(sin((3./5.)*time));
	float sizeCircle = tw(1.5)+0.2;
	position = vec2(2.0*tw, 0.0);
        p.x -= position.x;
	c += circle(p, sizeCircle) * turquoise;
	p.x += position.x;

        p.x += position.x;
	c += circle(p, sizeCircle) * blue;
	p.x -= position.x;
 
	// the dithering effect
	#ifdef DITHERING
	#if (DITHERING == 1)
	c += floor(p.y - fract(dot(gl_FragCoord.xy, vec2(0.4, 0.8))) * 10.0) * 0.05;  // dithering effect
	#endif
	#endif
	
	// the backbuffer "smoothing" effect
	#ifdef BACKBUFFER
	float value = (2./BACKBUFFER) * 0.15;
	c = (1.00 - value)*texture2D(bb, p0).xyz + value*c;
	c *= 1.07;
	#endif
	
	// the final fragment
	gl_FragColor = vec4(c, 1.0);
}