// Simple radar simulation with random generated Perlin map using the render buffer
// "P" scan
// code by Twareintor 2017, 2023
// copyright (c) 2017-2023 Twareintor aka Victorious aka Boooooster (C. Ciutacu)


#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

#define PI 3.14159265359

#define OMEGA 0.72 	// <0.8 upto GPU
#define RADIUS 210. // 
#define DECAY .987 // max.0.98
#define GRIDON true // 
#define DIRECTION 1. // 1. left, -1. right

#define NOISE_DENSITY .7 // simulation of the clutter


float circleA(vec3 p0, float rad, float size)
{
    float q;
    vec3 p = gl_FragCoord.xyz-p0;
    q = clamp(size/2./abs((abs(length(gl_FragCoord.xyz-p0)-rad))), 0., 1.);
    return q;
}

float point(vec3 p0, float size)
{
    float q = clamp(1.-float(length(gl_FragCoord.xyz-p0)/size), 0., 1.);
    return q;
}

// a line not a segment; use segment
float line(vec3 p0, vec3 p1, float size)
{
    vec3 pos = p0+normalize(p1-p0)*length(gl_FragCoord.xyz-p0)*dot(normalize(p1-p0), normalize(gl_FragCoord.xyz-p0));
    float q = clamp(1.-float(length(gl_FragCoord.xyz-pos)/size), 0., 1.); 
    return q;
}

// draws a segment; szie is the width; if ends then adds "points" at ends
float segment(vec3 p0, vec3 p1, float size, bool ends)
{
    float q = line(p0, p1, size);
    // limit the line at its ends:
    q*=float(0.0>=dot(normalize(gl_FragCoord.xyz-p0), normalize(gl_FragCoord.xyz-p1)));
    if(ends) q = max(q, point(p0, size)); // adding points same size at ends
    return q;
}

/** block from: "http://www.glslsandbox.com/e#40767.0" */
float r(vec2 n) 
{
    return fract(cos(dot(n,vec2(26.26,73.12)))*354.63);
}

float noise(vec2 n) 
{
    vec2 fn = floor(n);
    vec2 sn = smoothstep(0.,1.,fract(n));
    
    float h1 = mix(r(fn),           r(fn+vec2(1,0)), sn.x);
    float h2 = mix(r(fn+vec2(0,1)), r(fn+1.)       , sn.x);
    return mix(h1,h2,sn.y);
}

float perlin(vec2 n) 
{  
    float y = 0.;
    y+= noise(n/32.)*0.5875;
    y/=NOISE_DENSITY;
    y+= noise(n/16.)/5.;
    y+= noise(n/8.)/10.;
    y+= noise(n/4.)/20.;
    y+= noise(n/2.)/40.;
    y+= noise(n)/80.;

    return y;
}

vec2 rotate(vec2 v, float a) 
{
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

/** 
 * the main function here: 
 * not optimized; 
 */
void main()
{
    vec3 cen = vec3(resolution/2., 0.); // center
    vec4 outColor; // "output value" the output color 
    vec3 outer[3]; // ... can't remember what is for...
     
    for(int i=0; i<3; i++) // why 3? it works with 15 too!
    {
        float phase = PI*2./3.*float(i);	
        outer[i] = RADIUS*vec3(
                +cos(OMEGA*time + phase), 
                DIRECTION*sin(OMEGA*time+phase), 0.
	);
    }
    
    // float lr = segment(cen, cen+outer[0], 3.0, true);
    // the radar cursor: lg and lg2
    float lg = segment(cen, cen+outer[1], 3.0, true);
    float lg2 = segment(cen, cen+outer[1], 2.0, true);
    lg2*=.15;
    // float lb = segment(cen, cen+outer[2], 3.0, true);
    float cursor = lg;	

    /** */
    if((lg)>.05)
    {
        vec2 map = vec2(gl_FragCoord.xy + .25*vec2(0., time));
	float clutter = perlin(map);
        cursor*=float(clutter>.29 && clutter<.30);
    }
    cursor+=lg2; // the beam 
    
    /**   */
    float rings, rays; // range rings; rays (if you want)

    // set GRIDON to false to only have the display:
    if(GRIDON)	/** the grid: range rings and rays  */
    {
        // the horizon/ range rings (4x)
        rings = circleA(cen, RADIUS*1., .009);
        rings+=circleA(cen, RADIUS*.75, .006);
        rings+=circleA(cen, RADIUS*.5, .006);
        rings+=circleA(cen, RADIUS*.25, .006);
        // rays:
        for(int i=0; i<8; i++) // rays: 8x major + 8x minor
        {
            float phase = 2.*PI/8.*float(i); // 
            vec3 p0 = cen+RADIUS/4.*vec3(cos(phase), sin(phase), -0.00);
            vec3 p1 = cen+RADIUS*vec3(cos(phase), sin(phase), 0.000);
            // now the rays (major x8; minor x8 at 45°)
            rays+=segment(p0, p1, .75, true); // 
	    // peripherial rays (8x)
            p0 = cen+RADIUS/1.33*vec3(cos(phase+PI/8.), sin(phase+PI/8.), -0.00);
            p1 = cen+RADIUS*vec3(cos(phase+PI/8.), sin(phase+PI/8.), 0.00);		
            // final value for rays
            rays+=segment(p0, p1, .75, false);
            
        }
	    
    }
    
    // 
    outColor = vec4(0., cursor, mix(rings, rays, 0.15), 1.0);
    vec2 uv=gl_FragCoord.xy/resolution.xy; // make a texture from the buffer, 
    outColor+=texture2D(renderbuffer, uv)*DECAY; // ... to simulate the hysteresys
    gl_FragColor = outColor; // output value and finish

}


