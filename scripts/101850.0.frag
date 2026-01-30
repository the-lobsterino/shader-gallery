/*
 * Original shader from: https://www.shadertoy.com/view/styyWD
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime (time * BPM / 124.141)
#define iResolution resolution
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
//                   = Anaglyph Neural Core =         
//                by Maximilian Knape ·∑>|  2022            
// -----------------------------------------------------------
// This work is licensed under a Creative Commons Attribution-
//        NonCommercial-ShareAlike 3.0 Unported License


#define GAMMA vec3(.4545)

#define MAX_STEPS 120
#define MAX_DIST 80.
#define SURF_DIST .00001
#define SURF_MUL 13000.

#define EYE_DIS 0.75
#define FIL_COR 1.2

#define BPM 127. //Set your own speed
//#define iTime iTime * BPM / 124.141

mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

float GetDist(vec3 p) {

    p *= 1. + smoothstep(-1., 0.5,sin(iTime*6.5))*0.01;
    vec3 r = p ;
    float l = length(p);
    r.xz *= Rot(sin(iTime/19.)*6.28*smoothstep(10., MAX_DIST, l));
    r.zy *= Rot(sin(iTime/14.)*6.28*smoothstep(5., MAX_DIST, l));
    r.yx *= Rot(sin(iTime/11.)*6.28*smoothstep(3., MAX_DIST, l));
    
    float web = length(cross(sin(r/ (1.0 + smoothstep(5., 10., l))), normalize(r)))-(sin(iTime*1.75+r.y-r.z)*0.02+0.03);
    
    float dp = 1. - smoothstep(0., 1., dot(sin(p/10.), cos(p/10.))+sin(iTime/3.25));
    web -= smoothstep(0.98, 1., sin(pow(length(p), 1.7)/50. - (iTime*3.25)))*0.08*dp;
    
    p *= 1. + smoothstep(-0.5,1.0,sin(iTime*3.25))*0.1;

    float wire = abs(dot(sin(p+vec3(0.,0.,0.)), cos(p+(3.14/2.))))-(smoothstep(-0.5, 1., sin(iTime/17.))*3.);
                         
    p *= 1. + smoothstep(-0.3,1.0,sin(iTime*6.5))*(0.1+sin(iTime*3.25)*0.05);
    
    float sphere = abs(length(p)-5.+(sin(iTime/7.)*2.))-(sin(iTime/21.)*.5+1.);

    float d = mix(sphere, wire, 0.5+(sin(iTime/11.)*0.2));
    
    
    d = mix(d, web, sin(iTime/12.)*0.25+0.3);
    
    
    d = min(d, pow(web, 1.2));
    
    return d;
}

vec3 GetNormal(vec3 p) {
    vec2 e = vec2(.001, 0);
    vec3 n = GetDist(p) - 
        vec3(GetDist(p-e.xyy), GetDist(p-e.yxy),GetDist(p-e.yyx));
    
    return normalize(n);
}

vec3 RayMarch(vec3 ro, vec3 rd) {
	float dO=17.0;
    int steps = 0;
    for(int i=0; i<MAX_STEPS; i++) {
        steps = i;
    	vec3 p = ro + rd*dO;
        float dS = GetDist(p);
        dO += dS;
        if(dO>MAX_DIST || dS<(SURF_DIST * (pow(dO/ MAX_DIST,1.5)*SURF_MUL+1.))) break;
    }
    
    return vec3(dO, steps, 0.);
}



float GetLight(vec3 p) {
    vec3 lightPos = vec3(cos(iTime / 12.)*30., 20., sin(iTime / 12.)*30.);
    vec3 l = normalize(lightPos-p);
    vec3 n = GetNormal(p);
    
    float dif = clamp(dot(n, l)*.5+.5, 0., 1.);
    
    return dif;
}

vec3 R(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 f = normalize(l-p),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = p+f*z,
        i = c + uv.x*r + uv.y*u,
        d = normalize(i-p);
    return d;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
	vec2 m = iMouse.xy/iResolution.xy;

    vec3 p1 = vec3(0), p2 = vec3(0);
    vec3 ro = vec3(0, 4.+(sin(iTime/13.)*5.), -30.+(sin(iTime/7.)*5.));
    ro.yz *= Rot(-m.y*3.14+1.);
    ro.xz *= Rot(-m.x*6.2831);
    vec3 rd = R(uv, ro, vec3(0,1,0), 1.+sin(iTime/3.)*.1);
    
    float bg = smoothstep(0.6+sin(iTime/2.7)*.2, 1.0, dot(abs(rd), (normalize(vec3(sin(iTime/1.6), sin(iTime/1.2), sin(iTime/0.5))))));
    float fac = smoothstep(0.0, 1., sin(iTime/1.3))*clamp(sin(iTime*3.25),0.,1.)*0.3*abs(sin(iTime/2.8));
    float colL = bg * fac;

    vec3 rmd = RayMarch(ro, rd);
    float depth = pow(1. - rmd.x / MAX_DIST, 1.0);

    if(rmd.x<MAX_DIST && rmd.x < (1.-colL)*MAX_DIST) 
    {
        p1 = ro + rd * rmd.x;
        colL = GetLight(p1) * depth * depth;
        colL += rmd.y / float(MAX_STEPS) * depth * (1.5-smoothstep(10., 20., length(p1)));
    }
    
    float eyedis = EYE_DIS; //smoothstep(-0.1, 0., sin(iTime/2.))*0.2;
    ro += cross(rd, vec3(0.,-1.,0.)) * eyedis;
    rd = R(uv, ro, vec3(0,1,0), 1.+sin(iTime/3.)*.1);
    
    bg = smoothstep(0.6+sin(iTime/2.7)*.2, 1.0, dot(abs(rd), (normalize(vec3(sin(iTime/1.6), sin(iTime/1.2), sin(iTime/0.5))))));
    float colR = bg * fac;

    rmd = RayMarch(ro, rd);
    depth = pow(1. - rmd.x / MAX_DIST, 1.0);

    if(rmd.x<MAX_DIST && rmd.x < (1.-colR)*MAX_DIST) 
    {
        p2 = ro + rd * rmd.x;
        colR = GetLight(p2) * depth * depth;
        colR += rmd.y / float(MAX_STEPS) * depth * (1.5-smoothstep(10., 20., length(p2)));
    }
    
    //filter correction
    colL *= FIL_COR; 
    colR /= FIL_COR;
    
    //neural flash
    float dp = 1. - smoothstep(0., 1., dot(sin(p1/10.), cos(p1/10.))+sin(iTime/3.25));
    float nfL = 1. - smoothstep(0.98, 1., sin(pow(length(p1), 1.7)/50. - (iTime*3.25))) * dp; 
    float nfR = 1. - smoothstep(0.98, 1., sin(pow(length(p2), 1.7)/50. - (iTime*3.25))) * dp;
    
    colL *= (1.5 - smoothstep(10., 15., length(p1)) * nfL);
    colR *= (1.5 - smoothstep(10., 15., length(p2)) * nfR);

    vec3 colS = smoothstep(vec3(0.), vec3(1.), vec3(colL, colR, colR)); //contrast
    
    colS = pow(colS, GAMMA);	//gamma correction
    
    fragColor = vec4(colS,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}