

// 
// radar sonar simulation demo code glsl
// code by Twareintor (2017) - copyright (c) 2017 Claudiu Ciutacu
// doesn't uses the render buffer anymore; in this case
//     the DECAY get another function: the spread angle
// mailto: ciutacu/d]gmail*com

// doesn't use the backbuffer
// note: my graphic card: NVIDIA GeForce


#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable



#define PI 3.14159265359

#define SPOT 7.
#define OMEGA 0.42 	// 
#define RADIUS 180. // 
#define DECAY .975 // max.0.98
#define GRIDON true // 
#define DIRECTION 1. // 1. (right) or -1. 
#define TRAVELSPEED 10.
#define OBSTACLESIZE .24 // reasonable???


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



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

float line(vec3 p0, vec3 p1, float size)
{
    vec3 pos = p0+normalize(p1-p0)*length(gl_FragCoord.xyz-p0)*dot(normalize(p1-p0), normalize(gl_FragCoord.xyz-p0));
    float q = clamp(1.-float(length(gl_FragCoord.xyz-pos)/size), 0., 1.); 
    return q;
}

float segment(vec3 p0, vec3 p1, float size, bool ends)
{
    float q = line(p0, p1, size);
    // limit the line at its ends:
    q*=float(0.0>=dot(normalize(gl_FragCoord.xyz-p0), normalize(gl_FragCoord.xyz-p1)));
    if(ends) q = max(q, point(p0, size)); // adding points same size at ends
    return q;
}

/** block from: "http://www.glslsandbox.com/e#40767.0" */
float r(vec2 n) {
    return fract(cos(dot(n,vec2(36.26,73.12)))*354.63);
}

float noise(vec2 n) 
{
    vec2 fn = floor(n);
    vec2 sn = smoothstep(0.,1.,fract(n));
    
    float h1 = mix(r(fn),           r(fn+vec2(1,0)), sn.x);
    float h2 = mix(r(fn+vec2(0,1)), r(fn+1.)       , sn.x);
    return mix(h1,h2,sn.y);
}

float perlin(vec2 n) {  
    return noise(n/32.)*0.5875+noise(n/16.)/5.+noise(n/8.)/10.+noise(n/4.)/20.+noise(n/2.)/40.+noise(n)/80.;
}

/** ~block from: */


void main() 
{
	float t = time;
	vec2 cen = resolution.xy/2.0;
	vec2 enem = cen+vec2(mouse.x, mouse.y)*RADIUS;
	float r = .0;
	float g = .0;
	float b = .0;
	vec2 f = gl_FragCoord.xy-cen;
	if(length(f)<RADIUS)
	{
	    /** the trace is green... */
	    g = f.x/length(f)*cos(t)+f.y/length(f)*sin(t)*DIRECTION;
	    g*=1.0-length(f)/RADIUS/128.9;
	    g = pow(g, 45.*DECAY);
	    g-=(SPOT-length(gl_FragCoord.xy-enem))*float((length(gl_FragCoord.xy-enem)<SPOT));
            g+=point(vec3(cen, 0.), 4.);
            float map = float(perlin(vec2(
		    gl_FragCoord.x, gl_FragCoord.y+time*TRAVELSPEED
	    	))>(1.-OBSTACLESIZE));
            g-=map;
	}
	else
	{
	    r=.1; g=.1; b=.1;
	}
	vec4 outColor = vec4(r, g, b, 1.0);
    /**   */
    float grid, grid2;
    if(GRIDON)	/** the grid  */
    {
        grid = circleA(vec3(cen, 0.), RADIUS+1., 1.35);
        grid+=circleA(vec3(cen, 0.), RADIUS/2., .31);
        grid+=circleA(vec3(cen, 0.), RADIUS/4., .21);
	grid+=circleA(vec3(cen, 0.), RADIUS*3./4., .21);
        for(int i=0; i<8; i++)
        {
            float phase = 2.*PI/8.*float(i);
            vec3 p0 = vec3(cen, 0.)+RADIUS/4.*vec3(cos(phase), sin(phase), 0.);
            vec3 p1 = vec3(cen, 0.)+RADIUS*vec3(cos(phase), sin(phase), 0.);
            grid2+=segment(p0, p1, 3.75, false);
	    /**** removed peripherial grid ****/
            p0 = vec3(cen, 0.)+RADIUS/1.25*vec3(cos(phase+PI/8.), sin(phase+PI/8.), 0.);
            p1 = vec3(cen, 0.)+RADIUS*vec3(cos(phase+PI/8.), sin(phase+PI/8.), 0.);		
            grid2+=segment(p0, p1, 3.75, false);
            
        }
	    
    }
    outColor = vec4(mix(grid, grid2, 0.15), g, 0., 1.0);
	gl_FragColor = outColor;

}