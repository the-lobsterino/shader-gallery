// sunrise on the sea
// simplified, less code...                    _
// code by Twareintor (2017) mailto: <<ciutacu/d]gmail*com>>
// license: non-commercial use only

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359

#define SUNSIZE 45.0
#define WINDSPEED 2.4
#define WAVEOFF 37.0 // rec 37.

#define WATERCOLOR vec4(0.0, 0.3, 0.9, 1.0)
#define WATERCONTRAST 2.1 // rec.2.1

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;


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

float sun(vec2 pos, float size, float intensity)
{
    float q = clamp(1./length(gl_FragCoord.xy-pos)*size, 0., 1.); 
    q*=clamp(intensity, 0., 1.);
	
    return q;
}

vec4 sky(vec2 pos, vec2 sunPos, float direction)
{
    /** two versions: one for the above part and one for the reflected */
    vec4 outColor = vec4(0., 0., 0., 1.);
    float r, g, b, q;
    float y = sunPos.y;	
    if(direction<0.) sunPos.y-=2.*(sunPos.y-pos.y); /** reflect the position of the sun */
    /** the Sun a combination of red and green */
    r = sun(sunPos, SUNSIZE/2.*(1.+(1.-direction*(-sunPos.y+pos.y)/resolution.y)), 0.+abs(+y+pos.y)/(resolution.y-pos.y));
    g = sun(sunPos, SUNSIZE/2.*(1.+(1.-direction*(-sunPos.y+pos.y)/resolution.y)), 0.+abs(+y-pos.y)/(resolution.y-pos.y));
    /** the sky just blue: */
    b = clamp(.5*abs(sunPos.y-pos.y+SUNSIZE)*(1./resolution.y+1./pos.y), 0.35, .99);
    /** ensures that only what above the horizon line (pos.y) will be displayed */
    q = clamp(direction*(gl_FragCoord.y-pos.y), 0., 1.); // displays what is above 
    /** blur effect  */
    float blurvSun = 1.0;
    if(direction<0.) blurvSun = 0.05*float(SUNSIZE-abs(gl_FragCoord.x-sunPos.x)+20.);
    outColor = max(outColor, vec4(r*q*blurvSun, g*q*blurvSun, (b-r*g)*q, 1.)); /** for the sky  */
    return outColor; 
}

vec4 sea(vec2 pos, vec4 skyColor)
{
    vec4 outColor = vec4(0.0, 0.0, 0.0, 1.0);
    float viewpoint = pow(tan(gl_FragCoord.y*PI/4./abs(pos.y-resolution.y+.1*abs(gl_FragCoord.y-pos.y)+gl_FragCoord.x/resolution.x*.5+WAVEOFF)), 2.);
    viewpoint = pow(viewpoint, 2.2);
    float q = (2.-sin(gl_FragCoord.y*viewpoint+(time+200.)*WINDSPEED))*.5; /** for startup: time not zero */
    q*=clamp(perlin(viewpoint*vec2((time+100.)*1.*32.+(gl_FragCoord.x-pos.x)*8.*1., +time*viewpoint*abs(gl_FragCoord.y-pos.y)/resolution.y+100.)), 0., 1.);
    q=pow(q, WATERCONTRAST); /** contrast */
    /** output color must contain the refleciton of the sun in the water!!! */
    outColor = mix(vec4(q, q, q, 1.0), WATERCOLOR, .2);
    outColor = outColor*skyColor;
	
    return outColor*float(pos.y>gl_FragCoord.y); // only what is "under" the horizont line (y of the position) is displayed

}

void main() 
{
    vec2 cen = resolution/2.;
    vec4 outColor = vec4(0., 0., 0., 1.);
    vec2 sunPos = vec2(mouse.x*resolution.x+180., mouse.y*resolution.y+120.);
    outColor = sky(cen, sunPos, 1.)*0.75;
    outColor = max(outColor, sea(cen, sky(cen, sunPos, -1.)));
	
    gl_FragColor = outColor; 

}			

