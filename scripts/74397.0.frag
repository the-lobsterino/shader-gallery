/*
 * Original shader from: https://www.shadertoy.com/view/ss33zn
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

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //
// Code by Flopine

// Thanks to wsmind, leon, XT95, lsdlive, lamogui, 
// Coyhot, Alkama,YX, NuSan, slerpy, wwrighter 
// BigWings and FabriceNeyret for teaching me

// Thanks LJ for giving me the spark :3

// Thanks to the Cookie Collective, which build a cozy and safe environment for me 
// and other to sprout :)  
// https://twitter.com/CookieDemoparty


#define BPM 105./60.
#define time iTime
#define PI acos(-1.)
#define TAU (2.*PI)

#define rot(a) mat2(cos(a),sin(a),-sin(a),cos(a))
#define mo(p,d) p=abs(p)-d;if(p.y>p.x)p=p.yx
#define rep(p,r) (p=mod(p,r)-r*0.5)
#define crep(p,c,l) p=p-c*clamp(round(p/c),-l,l)
#define pal(t,c,d) (vec3(0.9)+vec3(0.5)*cos(TAU*(c*t+d)))

#define frt(sp,off) fract((time+off)*sp)
#define flt(sp,off) floor((time+off)*sp)
#define swi(sp,off) floor(sin(frt(sp,off)*TAU)+1.)

float triprism (vec3 p, vec2 h)
{
  vec3 q = abs(p);
  return max(q.z-h.y,max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5);
}

float cid;
float column (vec3 p, float o)
{
    float per=1.1;
    cid = floor(p.z/per);
    float off = cid*o,
    anim = PI/3.*(flt(BPM,off)+pow(frt(BPM,off),3.));
   
    rep(p.z,per);
    mo(p.xy,vec2(.9));
    p.y -= 2.;
    p.xy*=rot(anim);
  
    return triprism(p,vec2(3.,per*.15));
}

float SDF (vec3 p)
{
    p.yz *= rot(atan(1./sqrt(2.)));
    if (swi(BPM/4.,0.)<0.5) p.xz*=rot(PI/4.);
    
    float id = round(p.x/9.);
    crep(p.x,9.,4.);
    float d = column(p,abs(id)-1.*0.2);
    
    return d;
}

vec3 gn (vec3 p)
{
    vec2 eps = vec2(0.01,0.);
    return normalize(SDF(p)-vec3(SDF(p-eps.xyy),SDF(p-eps.yxy),SDF(p-eps.yyx)));
}

void mainImage (out vec4 fragColor, in vec2 fragCoord)
{
  vec2 uv = (2.*fragCoord.xy-iResolution.xy)/iResolution.y;
  vec2 a = vec2(abs(uv.x*0.5),0.25);
  vec3 ro = vec3(uv*17.,-100.), rd=vec3(0.,0.,1.),p=ro,
    col=vec3(0.),  
    l=normalize(vec3(1.,2.,-3.));

    bool hit=false;
    for (float i=0.; i<64.;i++)
    {
        float d = SDF(p);
        if (d<0.0001)
        {hit = true; break;}
        p += d*rd*0.5;
    }    
    if (hit)
    {
        vec3 n = gn(p);
        float li = dot(n,l)*.5+.5;
        col = pal(cid,vec3(0.1),vec3(0.1,0.8,0.3))*li;
    }

    fragColor = vec4(sqrt(col),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}