/*
 * Original shader from: https://www.shadertoy.com/view/3tsXD4
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
const vec4 iMouse = vec4(0.0);

// Emulate a black texture
#define texture(s, uv, lod) vec4(0.0)
#define textureLod(s, uv, lod) vec4(0.0)
#define texelFetch(s, uv, lod) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
// created by florian berger (flockaroo) - 2018
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// some quaternion functions, frustum

#define PI2 (3.141592653*2.)
vec4 multQuat(vec4 a, vec4 b)
{
    return vec4(cross(a.xyz,b.xyz) + a.xyz*b.w + b.xyz*a.w, a.w*b.w - dot(a.xyz,b.xyz));
}

vec3 transformVecByQuat( vec3 v, vec4 q )
{
    return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w*v );
}

vec4 angVec2Quat(vec3 ang)
{
    float lang=length(ang);
    return vec4(ang/lang,1) * sin(vec2(lang*.5)+vec2(0,PI2*.25)).xxxy;
}

vec4 axAng2Quat(vec3 ax, float ang)
{
    return vec4(normalize(ax),1) * sin(vec2(ang*.5)+vec2(0,PI2*.25)).xxxy;
}

vec4 inverseQuat(vec4 q)
{
    //return vec4(-q.xyz,q.w)/length(q);
    // if already normalized this is enough
    return vec4(-q.xyz,q.w);
}

vec4 slerpQuat(vec4 q1, vec4 q2, float t)
{
    vec4 q3;
    float dot = dot(q1, q2);

    /*	dot = cos(theta)
     if (dot < 0), q1 and q2 are more than 90 degrees apart,
     so we can invert one to reduce spinning	*/
    if (dot < 0.0)
    {
        dot = -dot;
        q3 = -q2;
    } else q3 = q2;

    if (dot < 0.95)
    {
        float angle = acos(dot);
        return (q1*sin(angle*(1.0-t)) + q3*sin(angle*t))/sin(angle);
    } else // if the angle is small, use linear interpolation
        return mix(q1,q3,t);
}

vec4 mirrorQuat(vec4 q, vec3 n)
{
    //rotate projector around axis which lying in mirror plane and is normal to projector x axis
    //mirroring has to be done afterwards in x
    // should be as simple as that: (rotating camera-x into mirror normal is exactly half the angle)
    vec3 bx=transformVecByQuat(vec3(1,0,0),q);
    vec3 axe=cross(bx,n);
    vec4 qr=vec4(-axe,-sign(dot(n,bx))*sqrt(1.-dot(axe,axe)));
    return multQuat(qr,q);
}

// glFustum reimplemented
mat4 myFrustum(float l, float r, float b, float t, float n, float f)
{
    return mat4(
        2.*n/(r-l),0,0,0,
        0,2.*n/(t-b),0,0,
        (r+l)/(r-l),(t+b)/(t-b),(n+f)/(n-f),-1,
        0,0,2.*f*n/(n-f),0
        );
}

// created by florian berger (flockaroo) - 2019
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// soldered star

// play around with the defines below.
// ...didnt want to enable shadow by default because 60 fps are really nice on this one

//#define ZOPF
//#define SHADOW
#define DIFFUSE
#define BG_COLOR vec3(1.)
#define AMBIENT .5

#ifdef SHADEROO
#include Include_A.glsl
#endif

vec4 getRand(vec3 pos)
{
    vec4 r = vec4(1.0);
    r*=textureLod(iChannel0,pos.xy,0.)*2.-1.;
    r*=textureLod(iChannel0,pos.xz,0.)*2.-1.;
    r*=textureLod(iChannel0,pos.zy,0.)*2.-1.;
    return r;
}

mat3 rotX(float ang)
{
    float c=cos(ang), s=sin(ang);
    return mat3(1,0,0, 0,c,s, 0,-s,c);
}

mat3 rotZ(float ang)
{
    float c=cos(ang), s=sin(ang);
    return mat3(c,s,0, -s,c,0, 0,0,1);
}

float lineDist( vec3 p, vec3 a, vec3 b )
{
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

float lineDistInf( vec3 p, vec3 a, vec3 b )
{
    return length( p-a - dot(p-a,b-a)*(b-a)/dot(b-a,b-a) );
}

vec2 distTetraM( vec3 p )
{
    vec3 v=.577*vec3(1,-1,1);
    float d=10000.;
    vec3 pa=abs(p);
    if(pa.x>pa.y && pa.x>pa.z) p=p.yzx;
    if(pa.y>pa.x && pa.y>pa.z) p=p.zxy;
    if(p.z<0.) p=p.yxz*vec3(-1,1,-1);
    //d=min(d,lineDist(p,v.yxx,v.xyx));
    //d=min(d,lineDistInf(p,v.yxx,v.xyx)-.04);
    vec3 bz=normalize(v.xyx-v.yxx);
    vec3 bx=vec3(bz.y,-bz.x,0);
    vec3 by=cross(bz,bx);
    vec3 pr=vec3(dot(p,bx),dot(p,by),dot(p,bz));
    float r0=.045;
    #ifdef ZOPF
    float ang = dot(p,bz)*PI2*2.;
    float r=r0*(1.-pr.z*pr.z);
    for(int i=0;i<3;i++)
    {
        vec2 cs=vec2(.5,1.)*cos(ang*vec2(2,1)+vec2(0,-PI2*.16666));
        d=min(d,lineDistInf(p+r*cs.y*bx+r*cs.x*by,v.yxx,v.xyx)-r0*4./7.);
        ang+=PI2*.66666;
    }

    #else
    
    vec2 cs=cos(vec2(0,-PI2*.25)+atan(pr.y,pr.x)+dot(p,bz)*PI2*2.);
    float r=r0*(1.-1.*pr.z*pr.z);
    d=min(d,lineDistInf(p-r*cs.x*bx-r*cs.y*by,v.yxx,v.xyx)-r0*4./9.);
    d=min(d,lineDistInf(p+r*cs.x*bx+r*cs.y*by,v.yxx,v.xyx)-r0*4./9.);
    d=min(d,lineDistInf(p+r*cs.y*bx-r*cs.x*by,v.yxx,v.xyx)-r0*4./9.);
    d=min(d,lineDistInf(p-r*cs.y*bx+r*cs.x*by,v.yxx,v.xyx)-r0*4./9.);
    
    #endif

    float dc=lineDistInf(p,v.yxx,v.xyx)-r0*(1.05+.2*smoothstep(.71,.717,abs(pr.z)));
    float d2=mix(d,dc,smoothstep(.69,.712,abs(pr.z)));
    float m=(abs(d2-d)*abs(d2-dc))/.001;
    //m=abs(d2-d)/.001;
    //m=abs(d2-dc)*abs(d2-d)/.00001;
    //if(d2!=d && d2!=dc) m=1.;
    
    if(     d2==d)  m=0.;
    else if(d2==dc) m=2.;
    else            m=1.;
    d=d2;
    
    return vec2(d,m);
}



vec2 distM( vec3 p )
{
    /*p+=.00008*getRand(p*.7).xyz*4.;
    p+=.00003*getRand(p*1.5).xyz*4.;
    p+=.00020*getRand(p*.25).xyz*4.;*/
    float d=10000.;
    vec4 q;

    float a5  = sqrt((5.-sqrt(5.))/2.);
    float a10 = 2./(1.+sqrt(5.));
    float sinPI2_10=a5/2.;
    float sinPI2_20=a10/2.;
    float ad = 4./sqrt(3.)/(1.+sqrt(5.));
    float at = 4./sqrt(6.);
    //float r5 = ad/2./sin(PI2/10.);
    //float r5 = ad/2./(a5*.5);
    float r5 = 4./sqrt(3.)/(1.+sqrt(5.)) / sqrt((5.-sqrt(5.))/2.);
    //float s = sqrt(6.)/(1.+sqrt(5.))/2.*r5;
    //float s = 2./( (3.+sqrt(5.))*sqrt(5.-sqrt(5.)) );
    float s = sqrt(5.-sqrt(5.)) / ( 5.+sqrt(5.) );
    //float ang = PI2/8.-asin(s);
    //float c2 =  1./sqrt(2.)*(sqrt(1.-s*s)+s);
    /*float c2 =  1./sqrt(2.)*(
        sqrt( 1.- (5.-sqrt(5.)) / ( 5.+sqrt(5.) )/ ( 5.+sqrt(5.) ) )
        +sqrt(5.-sqrt(5.)) / ( 5.+sqrt(5.) )
        );*/
    float s5=sqrt(5.);
    //float c = ( sqrt( 25.+11.*s5 ) + sqrt(5.-s5) ) / (5.+s5)/sqrt(2.) ;
    float c = ( sqrt(5.*s5+11.) + sqrt(s5-1.) ) / (s5+1.)/sqrt(2.*s5) ;
    //float ang = acos(c);
    float ang = PI2/8.-asin(r5*sin(PI2/20.)/at*2.);
    //ang = PI2/8.-ang;
    
    
    //q=vec4(0,0,sinAng,cosAng);
    //p=transformVecByQuat(p,q);
    
    // 7,4 is quite a lucky shot... exact is below
    //q=axAng2Quat(vec3(7,4,0),PI2/5.);
    // 8,5 is even better
    //q=axAng2Quat(vec3(8,5,0),PI2/5.);
    //q=axAng2Quat(vec3(cos(ang),sin(ang),0.),PI2/5.);
    q=axAng2Quat(vec3(c,sqrt(1.-c*c),0.),PI2/5.);
    
    //make the small pentagonal crown show in z direction
    vec4 q0=vec4(normalize(cross(q.xyz,vec3(0,0,1))),1.)/sqrt(2.);
    p=transformVecByQuat(p,q0);
    
    float m=0.;
    
    for(int i=0;i<5;i++)
    {
        vec2 dm=distTetraM(p);
        float dold=d;
        d=min( d, dm.x );
        if(d<dold) m=dm.y;
        p=transformVecByQuat(p,q);
    }
    
    //d-=.05;
    return vec2(d,m);
}

float dist(vec3 pos) { return distM(pos).x; }

vec3 getGrad(vec3 pos, float eps)
{
    vec2 d=vec2(eps,0);
    float d0=dist(pos);
    return vec3(dist(pos+d.xyy)-d0,
                dist(pos+d.yxy)-d0,
                dist(pos+d.yyx)-d0)/eps;
                
}

// march it...
vec4 march(inout vec3 pos, vec3 dir)
{
    // cull the sphere
    if(length(pos-dir*dot(dir,pos))>1.1) 
    	return vec4(0,0,0,1);
    
    float m=0.;
    float eps=0.003;
    float bg=1.0;
    float d=10000., dp=0.;
    float dmin=d;
    for(int cnt=0;cnt<40;cnt++)
    {
        dp=cnt==0?0.:d;
        vec2 dm = distM(pos);
        d=dm.x;
        if(d<dp) dmin=min(d,dmin);
        pos+=d*dir;
        if(d<eps) { m=dm.y; break; }
    }
    bg = smoothstep(.0,.2,d);
    return vec4(m,dmin,0,bg); // .w=1 => background
}

vec4 myenv(vec3 pos, vec3 dir, float period)
{
    #ifndef SHADEROO
    return texture(iChannel1,dir.xzy,.75);
    #else
    dir=normalize(dir);
    float azim = atan(dir.y,dir.x);
    float thr  = .5*.5*(.7*sin(2.*azim*5.)+.3*sin(2.*azim*7.));
    float thr2 = .5*.125*(.7*sin(2.*azim*13.)+.3*sin(2.*azim*27.));
    float thr3 = .5*.05*(.7*sin(2.*azim*32.)+.3*sin(2.*azim*47.));
    float br  = smoothstep(thr-.2, thr+.2, dir.z+.25);
    float br2 = smoothstep(thr2-.2,thr2+.2,dir.z+.15);
    float br3 = smoothstep(thr3-.2,thr3+.2,dir.z);
    vec4 r1 = .5*(texture(iChannel0,dir.xy*.01)-texture(iChannel0,dir.xy*.017+.33));
    vec3 skyCol=vec3(.9,1,1.1)+.5*(r1.xxx*.5+r1.xyz*.5);
    //skyCol*=2.5;
    vec4 r2 = .5*(texture(iChannel0,dir.xy*.1)-texture(iChannel0,dir.xy*.07-.33));
    vec3 floorCol = vec3(.9,1.1,1.)*.8+.5*(r2.xxx*.7+r2.xyz*.3);
    vec3 col=mix(floorCol.zyx,skyCol,br3);
    col=mix(floorCol.yzx*.7,col,br2);
    col=mix(floorCol.xyz*.7*.7,col,br);
    vec3 r=texture(iChannel0,vec2(azim/PI2*.125,.5)).xyz;
    col*= 1.-clamp(((r.xxx*.7+r.xzz*.3)*2.-1.)*clamp(1.-abs(dir.z*1.6),0.,1.),0.,1.);
    return vec4(pow(col,vec3(1.6))*.8*vec3(1.1,1,.9)/**clamp(1.+dir.x*.3,.9,1.2)*/,1);
    #endif
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // screen coord -1..1
    vec2 sc = (fragCoord.xy/iResolution.xy)*2.-1.;
    // viewer position
    vec3 pos = vec3(0,-4.,0);
    #ifdef SHADEROO
    pos.y*=1.-iMouseData.z/5000.;
    #endif
    if(iMouse.x<1.) pos.y*=(1.-.5*(.5-.5*cos(iTime*.1)));
    // pixel view direction
    vec3 dir = normalize(2.*normalize(-pos)+vec3(sc.x,0,sc.y*iResolution.y/iResolution.x));
    #ifdef DOF
    vec2 poff=(texture(iChannel0,(fragCoord+vec2(iFrame*13,iFrame*7))/Res0).xy-.5)*.02;
    pos.xz+=poff;
    dir.xz-=poff*dir.y/(-pos.y-zoomFunc(iTime));
    #endif
    // rotate view around x,z
    float phi = iMouse.x/iResolution.x*7.;
    float th  = iMouse.y/iResolution.y*7.;
    if (iMouse.x==0.) { phi=iTime; th=.27*iTime; }
    mat3 rx = rotX(th);
    mat3 rz = rotZ(phi);
    pos = rz*(rx*pos);
    dir = rz*(rx*dir);
    vec3 pos0 = pos;
    
   	vec4 mr=march(pos,dir);
    vec3 n = getGrad(pos,.001);
    float bg=mr.w;
    float m=mr.x;

    vec3 ldir=normalize(pos0-pos-vec3(.5,.5,.5));
    
    float diff = 1.;
    #ifdef DIFFUSE
    diff = 1.2*clamp(dot(n,ldir),0.,1.);
    #endif

    float sh=1.;
    #ifdef SHADOW
    vec3 pos2=pos-dir*.01;
    vec4 mr2=march(pos2,ldir);
    sh*=1.-max(1.-mr2.w,exp(-mr2.y*mr2.y/.02/.02));
    //sh*=clamp(dot(n,ldir),0.,1.);
    //sh=.4+.6*sh;
    //sh=.7*sh+.3;
    #endif
        
    // calc some ambient occlusion
    float ao=1.;
    // calc ao by stepping along normal
    ao*=dist(pos+n.xyz*.02)/.02;
    ao*=dist(pos+n.xyz*.05)/.05;
    ao*=dist(pos+n.xyz*.10)/.10;
    ao=clamp(ao,0.,1.);
    // adjust contrast of ao
    //ao=pow(ao,.4);
    
    // reflection dir
    vec3 R = (pos-pos0)-2.0*dot((pos-pos0),n.xyz)*n.xyz;
    R = ((R*rz)*rx);
    
    vec3      c = vec3(.55,.3,.2);   // copper
    if(m>.5 ) c = vec3(.4);          // tin
    if(m>1.5) c = vec3(.5,.4,.25);   // brass
    
    // simply add some parts of the normal to the color
    // gives impression of 3 lights from different dir with different color temperature
    c += n.xyz*vec3(1,.4,.7)*.05;
    //  reflection of cubemap (slightly tilt reflection map to floor - rotX(-.8))
    float sp=1.;
    sp-=.20*getRand(pos*2.).x*4.;
    sp-=.10*getRand(pos*4.).x*4.;
    sp-=.05*getRand(pos*8.).x*4.;
    c += sp*myenv(pos,rotX(-.8)*R,1.).xxx*.8;
    
    // apply ambient occlusion, diffuse, shadow
    c*=(1.-AMBIENT)*min(min(ao,diff),sh)+AMBIENT;

    //vec3 bgCol = mix(vec3(1.05,1.05,.95),vec3(.9,.95,1.),1.-length(sc));
    vec3 bgCol=BG_COLOR;
    //bgCol=myenv(vec3(0),dir,1.).xyz;
    
    // apply background
    float aspect=iResolution.y/iResolution.x;
    float r = length(vec2(sc.y*aspect,sc.x));
    c=mix(c,bgCol,bg);
    
    // add some depth fog
	c=mix(c,bgCol,clamp(dot(dir,pos)*.4,0.,1.));
	
    // vignetting
    vec2 sc2=(fragCoord-.5*iResolution.xy)/iResolution.x;
    float vign = 1.1-1.*dot(sc2,sc2);
    //vign-=dot(exp(-sin(fragCoord/iResolution.xy*3.14)*vec2(20,10)),vec2(1,1));
    vign*=1.-.3*exp(-sin(fragCoord.x/iResolution.x*3.1416)*20.);
    vign*=1.-.3*exp(-sin(fragCoord.y/iResolution.y*3.1416)*10.);

	fragColor = vec4(c*vign,1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}