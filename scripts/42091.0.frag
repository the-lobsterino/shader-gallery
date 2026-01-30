// Radar
// coded by Twareintor (2017) 
// mailto=>ciutacu(o]gmail:com

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

#define PI 3.14159265359

#define OMEGA .72 		// 1.25
#define RADIUS 210.


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
    vec3 cen = vec3(resolution/2., 0.);
    vec4 outColor;
    vec3 outer[3];
    for(int i=0; i<3; i++)
    {
        float phase = PI*2./3.*float(i);	
        outer[i] = RADIUS*vec3(+cos(OMEGA*time+phase), sin(OMEGA*time+phase), 0.);
    }
    // float lr = segment(cen, cen+outer[0], 3.0, true);
    float lg = segment(cen, cen+outer[1], 3.0, true);
    float lg2 = segment(cen, cen+outer[1], 1.0, true);
    lg2*=.15;
    // float lb = segment(cen, cen+outer[2], 3.0, true);
    float orange = lg;	
    /** */
    if((lg)>.05)
    {
	float map = perlin(gl_FragCoord.xy+vec2(time/10., time));
       orange*=float(map>.29 && map<.30);
    }
    orange+=lg2;
    /**   */
    
    outColor = vec4(0., orange, 0., 1.);
    vec2 uv=gl_FragCoord.xy/resolution.xy;
    outColor+=texture2D(renderbuffer, uv)*0.975;
    gl_FragColor = outColor;

}


