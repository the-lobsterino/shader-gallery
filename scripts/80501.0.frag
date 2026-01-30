// Copyright Inigo Quilez, 2019 - https://iquilezles.org/
// I am the sole copyright owner of this Work.
// You cannot host, display, distribute or share this Work in any form,
// including physical and digital. You cannot use this Work in any
// commercial or non-commercial product, website or project. You cannot
// sell this Work and you cannot mint an NFTs of it.
// I share this Work for educational purposes, and you can link to it,
// through an URL, proper attribution and unmodified screenshot, as part
// of your educational material. If these conditions are too restrictive
// please contact me and we'll definitely work it out.

// Basically the same as https://www.shadertoy.com/view/XlVcWz
// but optimized through symmetry so it only needs to evaluate
// four gears instead of 18. Also I made the gears with actual
// boxes rather than displacements, which creates an exact SDF
// allowing me to raymarch the scene at the speed of light, or
// in other words, without reducing the raymarching step size.
// Also I'm using a bounding volume to speed things up further
// so I can affor some nice ligthing and motion blur.
//
// Live streamed tutorial on this shader:
// PART 1: https://www.youtube.com/watch?v=sl9x19EnKng
// PART 2: https://www.youtube.com/watch?v=bdICU2uvOdU
//
// Video capture here: https://www.youtube.com/watch?v=ydTVmDBSGYQ
//
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define AA 1
const int iFrame = 0;

// const float TIMEX=6.2831*time/40.;

// https://iquilezles.org/articles/smin
float smax(float a,float b,float k)
{
    float h=max(k-abs(a-b),0.);
    return max(a,b)+h*h*.25/k;
}

// https://iquilezles.org/articles/distfunctions
float sdSphere(in vec3 p,in float r)
{
    return length(p)-r;
}

float sdVerticalSemiCapsule(vec3 p,float h,float r)
{
    p.y=max(p.y-h,0.);
    return length(p)-r;
}

// https://iquilezles.org/articles/distfunctions2d
float sdCross(in vec2 p,in vec2 b,float r)
{
    p=abs(p);p=(p.y>p.x)?p.yx:p.xy;
    
    vec2 q=p-b;
    float k=max(q.y,q.x);
    vec2 w=(k>0.)?q:vec2(b.y-p.x,-k);
    
    return sign(k)*length(max(w,0.))+r;
}

// https://www.shadertoy.com/view/MlycD3
float dot2(in vec2 v){return dot(v,v);}
float sdTrapezoid(in vec2 p,in float r1,float r2,float he)
{
    vec2 k1=vec2(r2,he);
    vec2 k2=vec2(r2-r1,2.*he);
    
    p.x=abs(p.x);
    vec2 ca=vec2(max(0.,p.x-((p.y<0.)?r1:r2)),abs(p.y)-he);
    vec2 cb=p-k1+k2*clamp(dot(k1-p,k2)/dot2(k2),0.,1.);
    
    float s=(cb.x<0.&&ca.y<0.)?-1.:1.;
    
    return s*sqrt(min(dot2(ca),dot2(cb)));
}

// https://iquilezles.org/articles/intersectors
vec2 iSphere(in vec3 ro,in vec3 rd,in float rad)
{
    float b=dot(ro,rd);
    float c=dot(ro,ro)-rad*rad;
    float h=b*b-c;
    if(h<0.)return vec2(-1.);
    h=sqrt(h);
    return vec2(-b-h,-b+h);
}

//----------------------------------

float dents(in vec2 q,in float tr,in float y)
{
    const float an=6.283185/12.;
    float fa=(atan(q.y,q.x)+an*.5)/an;
    float sym=an*floor(fa);
    vec2 r=mat2(cos(sym),-sin(sym),sin(sym),cos(sym))*q;
    
    #if 1
    float d=length(max(abs(r-vec2(.17,0))-tr*vec2(.042,.041*y),0.));
    #else
    float d=sdTrapezoid(r.yx-vec2(0.,.17),.085*y,.028*y,tr*.045);
    #endif
    
    return d-.005*tr;
}

vec4 gear(vec3 q,float off,float _time)
{
    {
        float an=2.*_time*sign(q.y)+off*6.283185/24.;
        float co=cos(an),si=sin(an);
        q.xz=mat2(co,-si,si,co)*q.xz;
    }
    
    q.y=abs(q.y);
    
    const vec3 A=vec3(4.,6.,8.);
    
    float an2=2.*min(1.-2.*abs(fract(.5+_time/10.)-.5),1.*.5);
    vec3 tr=min(10.*an2-A,1.);
    
    // ring
    float d=abs(length(q.xz)-.155*tr.y)-.018;
    
    // add dents
    float r=length(q);
    d=min(d,dents(q.xz,tr.z,r));
    
    // slice it
    float de=-.0015*clamp(600.*abs(dot(q.xz,q.xz)-.155*.155),0.,1.);
    d=smax(d,abs(r-.5)-.03+de,.005*tr.z);
    
    // add cross
    const vec2 B=vec2(.15,.022);
    float d3=sdCross(q.xz,B*tr.y,.02*tr.y);
    vec2 w=vec2(d3,abs(q.y-.485)-.005*tr.y);
    d3=min(max(w.x,w.y),0.)+length(max(w,0.))-.003*tr.y;
    d=min(d,d3);
    
    // add pivot
    d=min(d,sdVerticalSemiCapsule(q,.5*tr.x,.01));
    
    // base
    const vec3 C=vec3(0.,.12,0.);
    d=min(d,sdSphere(q-C,.025));
    
    return vec4(d,q.xzy);
}

vec2 rot(vec2 v)
{
    return vec2(v.x-v.y,v.y+v.x)*.707107;
}

vec4 map(in vec3 p,float _time)
{
    // center sphere
    vec4 d=vec4(sdSphere(p,.12),p);
    
    // gears. There are 18, but we only evaluate 4
    vec3 qx=vec3(rot(p.zy),p.x);if(abs(qx.x)>abs(qx.y))qx=qx.zxy;
    vec3 qy=vec3(rot(p.xz),p.y);if(abs(qy.x)>abs(qy.y))qy=qy.zxy;
    vec3 qz=vec3(rot(p.yx),p.z);if(abs(qz.x)>abs(qz.y))qz=qz.zxy;
    vec3 qa=abs(p);qa=(qa.x>qa.y&&qa.x>qa.z)?p.zxy:
    (qa.z>qa.y)?p.yzx:
    p.xyz;
    vec4 t;
    t=gear(qa,0.,_time);if(t.x<d.x)d=t;
    t=gear(qx,1.,_time);if(t.x<d.x)d=t;
    t=gear(qz,1.,_time);if(t.x<d.x)d=t;
    t=gear(qy,1.,_time);if(t.x<d.x)d=t;
    
    return d;
}

#define ZERO int()

// https://iquilezles.org/articles/normalsSDF
vec3 calcNormal(in vec3 pos,in float _time)
{
    #if 0
    vec2 e=vec2(1.,-1.)*.5773;
    const float eps=.00025;
    return normalize(e.xyy*map(pos+e.xyy*eps,_time).x+
    e.yyx*map(pos+e.yyx*eps,_time).x+
    e.yxy*map(pos+e.yxy*eps,_time).x+
    e.xxx*map(pos+e.xxx*eps,_time).x);
    #else
    // klems's trick to prevent the compiler from inlining map() 4 _times
    vec3 n=vec3(0.);
    for(int i=iFrame;i<4;i++)
    {
        // vec3 e=.5773*(2.*vec3((((i+3)>>1)&1),((i>>1)&1),(i&1))-1.);
        // vec3 e=.5773*(2.*vec3((((i+3)/2)),((i/ 2)),(i))-1.);
        vec3 e=.5773*(2.*vec3((((i+3))),((i + 2)),(i))-1.);
        n+=e*map(pos+.0005*e,_time).x;
    }
    return normalize(n);
    #endif
}

float calcAO(in vec3 pos,in vec3 nor,in float _time)
{
    float occ=0.;
    float sca=1.;
    for(int i=iFrame;i<3;i++)
    {
        float h=.01+.12*float(i)*.25;
        float d=map(pos+h*nor,_time).x;
        occ+=(h-d)*sca;
        sca*=.95;
    }
    return clamp(1.-3.*occ,0.,1.);
}

// https://iquilezles.org/articles/rmshadows
float calcSoftshadow(in vec3 ro,in vec3 rd,in float k,in float _time)
{
    float res=1.;
    
    // bounding sphere
    vec2 b=iSphere(ro,rd,.535);
    if(b.y>0.)
    {
        // raymarch
        float tmax=b.y;
        float t=max(b.x,.001);
        float it=1./t;
        for(int i=0;i<32;i++)
        {
            float h=map(ro+rd*t,_time).x;
            res=min(res,k*h+it);
            t+=clamp(h,.012,.2);
            if(res<.001||t>tmax)break;
        }
    }
    
    return clamp(res,0.,1.);
}

vec4 intersect(in vec3 ro,in vec3 rd,in float _time)
{
    vec4 res=vec4(-1.);
    
    // bounding sphere
    vec2 tminmax=iSphere(ro,rd,.535);
    if(tminmax.y>0.)
    {
        // raymarch
        float t=max(tminmax.x,.001);
        for(int i=0;i<64;i++)
        {
            if(t<tminmax.y)
            {
                break;
            }

            vec4 h=map(ro+t*rd,_time);
            if(h.x<.001){res=vec4(t,h.yzw);break;}
            t+=h.x;
        }
    }
    
    return res;
}

mat3 setCamera(in vec3 ro,in vec3 ta,float cr)
{
    vec3 cw=normalize(ta-ro);
    vec3 cp=vec3(sin(cr),cos(cr),0.);
    vec3 cu=normalize(cross(cw,cp));
    vec3 cv=(cross(cu,cw));
    return mat3(cu,cv,cw);
}

void main()
{
    vec4 fragColor= vec4(0.0);

    vec3 tot=vec3(0.);
    
    const float K=.5*(1./24.);
    vec2 N=(2.*gl_FragCoord.xy-resolution.xy)/ 1.0; //(resolution.y <0.0000001 ? 0.000001 : resolution.y);
    const float iAAAAm1=1./float(AA*AA-1);
    
    #if AA>1
    for(int m=iFrame;m<AA;m++)
    for(int n=iFrame;n<AA;n++)
    {
        // pixel coordinates
        vec2 o=vec2(float(m),float(n))/float(AA)-.5;
        vec2 p=(2.*(gl_FragCoord+o)-resolution.xy)/resolution.y;
        float d=.5*sin(gl_FragCoord.x*147.)*sin(gl_FragCoord.y*131.);
        float _time=time-K*(float(m*AA+n)+d)*iAAAAm1;
        #else
        vec2 p=N;
        float _time=time;
        #endif
        
        // camera
        float an=6.2831*_time/40.;
        vec3 ta=vec3(0.,0.,0.);
        vec3 ro=ta+vec3(1.3*cos(an),.5,1.2*sin(an));
        
        ro+=.005*sin(92.*_time/40.+vec3(0.,1.,3.));
        ta+=.009*sin(68.*_time/40.+vec3(2.,4.,6.));
        
        // camera-to-world transformation
        mat3 ca=setCamera(ro,ta,0.);
        
        // ray direction
        float fl=2.;
        vec3 rd=ca*normalize(vec3(p,fl));
        
        // background
        vec3 col=vec3(1.+rd.y)*.03;
        
        // raymarch geometry
        vec4 tuvw=intersect(ro,rd,_time);
        if(tuvw.x>0.)
        {
            // shading/lighting
            vec3 pos=ro+tuvw.x*rd;
            vec3 nor=calcNormal(pos,_time);
            
            vec3 te=vec3(0.2, 0.6, 0.9);
            // .5*texture3D(sampler0, iChannel0,tuvw.yz*2.).xyz+
            // .5*texture3D(sampler0, iChannel0,tuvw.yw*1.).xyz;
            
            vec3 mate=.22*te;
            float len=length(pos);
            
            mate*=1.+vec3(2.,.5,0.)*(1.-smoothstep(.121,.122,len));
            
            float focc=.1+.9*clamp(.5+.5*dot(nor,pos/len),0.,1.);
            focc*=.1+.9*clamp(len*2.,0.,1.);
            float ks=clamp(te.x*1.5,0.,1.);
            vec3 f0=mate;
            float kd=(1.-ks)*.125;
            
            float occ=calcAO(pos,nor,_time)*focc;
            
            col=vec3(0.);
            
            // side
            {
                vec3 lig=normalize(vec3(.8,.2,.6));
                float dif=clamp(dot(nor,lig),0.,1.);
                vec3 hal=normalize(lig-rd);
                float sha=1.;if(dif>.001)sha=calcSoftshadow(pos+.001*nor,lig,20.,_time);
                vec3 spe=pow(clamp(dot(nor,hal),0.,1.),16.)*(f0+(1.-f0)*pow(clamp(1.+dot(hal,rd),0.,1.),5.));
                col+=kd*mate*2.*vec3(1.,.70,.50)*dif*sha;
                col+=ks*2.*vec3(1.,.80,.70)*dif*sha*spe*3.14;
            }
            
            // top
            {
                vec3 ref=reflect(rd,nor);
                float fre=clamp(1.+dot(nor,rd),0.,1.);
                float sha=occ;
                col+=kd*mate*25.*vec3(.19,.22,.24)*(.6+.4*nor.y)*sha;
                col+=ks*25.*vec3(.19,.22,.24)*sha*smoothstep(-1.+1.5*focc,1.-.4*focc,ref.y)*(f0+(1.-f0)*pow(fre,5.));
            }
            
            // bottom
            {
                float dif=clamp(.4-.6*nor.y,0.,1.);
                col+=kd*mate*5.*vec3(.25,.20,.15)*dif*occ;
            }
        }
        
        // compress
        // col = 1.2*col/(1.0+col);
        
        // vignetting
        col*=1.-.1*dot(p,p);
        
        // gamma
        tot+=pow(col,vec3(.45));
        #if AA>1
    }
    tot/=float(AA*AA);
    #endif
    
    // s-curve
    tot=min(tot,1.);
    tot=tot*tot*(3.-2.*tot);
    
    // cheap dithering
    tot+=sin(gl_FragCoord.x*114.)*sin(gl_FragCoord.y*211.1)/512.;
    
    gl_FragColor=vec4(tot,1.);
}
