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


 // pre-processor makros  //
//  ==================== //

#define TAU 6.2831853071
#define time time * 4.8
#define tw(a) sin(a*time)*0.5 + 0.5

#define abc TAU
#define rot(a) mat2(cos(abc*a),-sin(abc*a),sin(abc*a),cos(abc*a))

#define mask0 vec3(1.0, 1.0, 1.0);
#define mask1 vec3(0.5, 0.6, 0.7);

#define DITHERING   1       // 0 = OFF, 1 = ON
#define BACKBUFFER  1.0     // uncomment for OFF

// pre-program  //
// =========== //

float tw = tw(1.0);  // defining tw as timewave with length 1.0


 // geometry  //
//  ======== //

float circle(vec2 p, float r)
{
	float t = atan(p.y/time*tw, p.x/time*tw);
	float o = step(length(p), r + 0.5*t);
	return o;
}

 // coloration  //
//  ========== //

vec3 niceColor(vec2 p)
{
	vec3 c;
        c.x = cos(0.0+(8./9.)*p.x);
	c.y = cos(1.0+(8./8.)*p.x);
 	c.z = cos(2.0+(8./7.)*p.x+6.0*time); 
	c += 0.25;
	c *= mask1;
	return c;
}


 // the program  //
//  =========== //

void main(void)
{
	// the fragments
	vec2 p = 1.5*(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 c;  // the color variable
	
	// this is needed for the backbuffer stuff
	vec2 p0 = gl_FragCoord.xy / resolution.xy;
	
	// rotation
	p *= rot(time);
	
	// some "night and day" color mask
	c = niceColor(p);
	
	// the circle
	float radius = tw + 0.1;
	c *= circle(p, radius);

	// the dithering effect
	#if (DITHERING == 1)
	c += floor(p.y - fract(dot(gl_FragCoord.xy, vec2(0.4, 0.8))) * 10.0) * 0.05;  // dithering effect
	#endif
	
	// the backbuffer "smoothing" effect
	#ifdef BACKBUFFER
	float value = (2./BACKBUFFER) * 0.15;
	c = (1.00 - value)*texture2D(bb, p0).xyz + value*c;
	#endif
	
	// the final fragment
	gl_FragColor = vec4(c, 1.0);
}