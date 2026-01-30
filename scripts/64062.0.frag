/*
 * Original shader from: https://www.shadertoy.com/view/ldVcRK
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// Emulate a black texture
#define sampler2D float
#define iChannel1 0.
#define texture(s, uv) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
// Created by evilryu
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Continue playing with folding lattice

#define PI 3.14159265

vec3 path(float p)
{
	return vec3(sin(p*0.05)*cos(p*0.05)*18., 0.,0.);
}

// folding from gaz: https://www.shadertoy.com/view/4tX3DS
vec2 fold(vec2 p, float a)
{
    p.x=abs(p.x);
    vec2 n = vec2(cos(a),sin(a));
    // change iteration to see different variations
    for(int i = 0; i < 2; ++i)
    {
        p -= 2.*min(0.,dot(p,n))*n;
        n = normalize(n-vec2(1.,0.));
    }
    return p;
}

mat2 rot(float t)
{
    float c=cos(t);
    float s=sin(t);
    return mat2(c,-s,s,c);
}

vec3 tri(vec3 p)
{
    return abs(fract(p)-0.5);
}

float tri_surf(vec3 p)
{
    return dot(tri(p*0.5+tri(p*0.25)), vec3(0.6666));
}

int mateid=0;

float map(vec3 p)
{
    mateid=0;
    
    p-=path(p.z);
    
    vec3 q=p;
    
    p.z*=0.6;
    p=vec3(rot(0.07*p.z)*p.xy, p.z);
    p.xy=fold(p.xy,PI/3.);
    vec3 p1=mod(p,2.5)-1.25;
	
    float ts=0.5-tri_surf(p*7.);
    // variation of BCC lattice from paniq: https://www.shadertoy.com/view/llfGRj
    vec3 o=abs(p1); 
    o-=(o.x*1.95+o.y+o.z)*0.33333;
    float d0=max(o.x,max(o.y,o.z))-0.03+0.05*ts;
    
    // another layer
	vec3 p2=mod(p-vec3(4.2,0.,0),2.5)-1.25;
    o = abs(p2); 
    o-=(o.x*1.8+o.y+o.z)*0.33333;
    float d4=max(o.x,max(o.y,o.z))-0.01+0.05*ts;
    if(d4<d0)
    {
        d0=d4;
        mateid=2;
    }
    
    float d1=length(q.xy)-1.+0.2*ts;
    d0=max(d0,-d1);
   
    float d2=abs(q.y+1.1+0.02*texture(iChannel1,0.1*q.xz).x);
    if(d2<d0) mateid=1;
    
    d0=min(d0,d2);    

    return d0;
}

vec3 get_normal(vec3 p)
{ 
    vec3 e=vec3(0.003,0.0,0.0); 
    return normalize(vec3(map(p+e.xyy)-map(p-e.xyy), 
                          map(p+e.yxy)-map(p-e.yxy), 
                          map(p+e.yyx)-map(p-e.yyx))); 
} 

float intersect(vec3 ro, vec3 rd)
{
    float t=0.01;
    float d=map(ro+t*rd);
    for(int i=0;i<128;++i)
    {
        if(abs(d)<0.001||t>100.)
            continue;
        t+=d;
        d=map(ro+t*rd);
    }
    if(t>100.)t=-1.;
    return t;
}

vec3 hash13(float n)
{
    return fract(sin(vec3(n,n+1.0,n+2.0))*vec3(43758.5453123,22578.1459123,19642.3490423));
}

// curvature from iq: https://www.shadertoy.com/view/MsXGzM
float curvature(vec3 p, vec3 n)
{
    float acc=0.0;
    for(int i=0;i<4;i++)
    {
        vec3 aopos=normalize(hash13(float(i)*213.47));
        aopos=aopos-dot(n,aopos)*n;
        aopos=p+aopos*0.03;
        float dd=clamp(map(aopos)*100.0, 0.0, 1.0 );
        acc+=dd;
    }
    return smoothstep(0.2, 1.0, acc/4.0);
}

float shadow(vec3 ro, vec3 rd, float dist)
{
    float res=1.0;
    float t=0.05;
    float h;
    
    for(int i=0;i<12;i++)
    {
        if(t>dist) continue;
        h=map(ro+rd*t);
        res = min(6.0*h/t, res);
        t+=h;
    }
    return max(res, 0.0);
}                                                           

// density from aiekick: https://www.shadertoy.com/view/lljyWm
float density(vec3 p, float ms) 
{
	vec3 n = get_normal(p); 
	return map(p-n*ms)/ms;
}

// env mapping from Shane: https://www.shadertoy.com/view/4ttGDH
vec4 texcube(sampler2D sam, vec3 p, vec3 n)
{
    n = max(abs(n) - .2, 0.001);
    n /= dot(n, vec3(1));
    vec4 p1=texture(sam, p.xy);
    vec4 p2=texture(sam, p.xz);
    vec4 p3=texture(sam, p.yz);
    return p1*abs(n.z)+p2*abs(n.y)+p3*abs(n.x);
}

vec3 env_map(vec3 rd, vec3 n)
{
    vec3 col = texcube(iChannel1, rd, n).xyz;
    return smoothstep(0., 1., col);
}

vec3 tonemap(vec3 x) 
{
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    return (x * (a * x + b)) / (x * (c * x + d) + e);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 q=fragCoord.xy/iResolution.xy;
    vec2 p=q*2.-1.;
    p.x*=iResolution.x/iResolution.y;
    vec3 ro=vec3(0.,0.,-iTime*2.);
    vec3 ta=ro+vec3(0,0,-1.);
    
    vec3 lp0=ro+vec3(0,-0.6,-3.);
    
    ro+=path(ro.z);
    ta+=path(ta.z);
	lp0+=path(lp0.z);
    
    vec3 f=normalize(ta-ro);
    vec3 r=normalize(cross(f,vec3(0,1,0)));
    vec3 u=normalize(cross(r,f));
    
    vec3 rd=normalize(mat3(r,u,f)*vec3(p.xy,PI/2.));
    vec3 col=vec3(0.6,0.8,1.1);

    float t=intersect(ro,rd);
    if(t>-0.5)
    {
        vec3 pos=ro+t*rd;
        vec3 n=get_normal(pos);
        
        vec3 mate=2.*vec3(.9,0.3,.9);
        float cur = curvature(pos, n);
        
        mate+=cur*vec3(1.);
        if(mateid==1)
        {
        	vec3 tex=texture(iChannel1,0.5*pos.xz).xyz;
            mate=1.*vec3(.6*tex.x,.8*tex.x,1.*tex.x);
        }
        else if(mateid>1)
        {
            mate=2.*vec3(1.2,.85,.2);
        }
                
        vec3 ld0=lp0-pos;
        float ldist=length(ld0);
        ld0/=ldist;
        vec3 lc0=vec3(1.2,0.8,0.5);
        
        float sha=shadow(pos+0.01*n, ld0, ldist);
        float dif=max(0.,dot(n,ld0))*sha;
        float bac=max(0.,dot(n,-ld0));
        float amb=max(0.,dot(n,vec3(0,1,0)))*max(0.,(pos.y+1.));
        float spe=pow(clamp(dot(ld0, reflect(rd, n)), 0.0, 1.0), 16.0);
        float fre=clamp(1.0+dot(rd,n), .0, 1.); 
        
        float sca=1.-density(pos,0.2);
 
        vec3 Lo=(2.5*dif*lc0+
                 5.*spe*vec3(1.)*sha+
                 pow(fre,8.)*vec3(1.1))/(ldist);
        Lo+=.5*amb*vec3(0.5,0.8,1.);    
        Lo+=0.3*bac*lc0;
        
        vec3 refl=env_map(reflect(rd,n), n);
        vec3 refr=env_map(refract(rd,n,1./1.35), n);

        if(mateid==2)
        	Lo+=vec3(1.2,0.6,0.2)*sca*0.25;
        if(mateid==0)
        	Lo+=vec3(0.2,0.6,1.2)*sca*0.25*sha;
        Lo+=mix(refr,refl,pow(fre, 5.));
        
        col=mate*Lo*0.2;
    }

    col=mix(col, .6*vec3(2.3,0.6,1.1), 1.0-exp(-0.0034*t*t) );
    col=tonemap(col);
    col=pow(clamp(col,0.0,1.0),vec3(0.45));    
    col=pow(col,vec3(0.95,.9,0.85));
    col*=pow(16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1);
    fragColor.xyz=col;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}