/*
 * Original shader from: https://www.shadertoy.com/view/7tVBR3
 */

#ifdef GL_ES
precision highp float;
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
// BigWings, FabriceNeyret and Blackle for teaching me

// Thanks LJ for giving me the spark :3

// Thanks to the Cookie Collective, which build a cozy and safe environment for me 
// and other to sprout :)  
// https://twitter.com/CookieDemoparty


#define PI acos(-1.)
#define rot(a) mat2(cos(a),sin(a),-sin(a),cos(a))
#define crep(p,c,l) p-=c*clamp(round(p/c), -l ,l)
#define dt(sp,off) fract((iTime+off)*sp)

float box (vec3 p, vec3 c)
{
    vec3 q = abs(p)-c;
    return min(0., max(q.x,max(q.y,q.z)))+length(max(q,0.));
}

float g1=0.;
float SDF (vec3 p )
{
    p.yz *= rot(-atan(1./sqrt(2.)));
    p.xz *= rot(PI/4.);
    
    float d = length(p)-7.;
    g1 += 0.1/(0.1+d*d);
    
    float per = 2.;
    vec3 id = round(p/per);
    p.xz *= rot( dt(0.05, length(id)*0.15)*(2.*PI) );
    p.xy *= rot( dt(0.08, 0.)*(2.*PI) );
    p = crep(p, per, 5.);
    
    return min(d,box (p,vec3(.95)));
}

vec3 gn (vec3 p)
{
    vec2 e = vec2(0.01,0.);
    return normalize(SDF(p)-vec3(SDF(p-e.xyy),SDF(p-e.yxy),SDF(p-e.yyx)));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (2.*fragCoord-iResolution.xy)/iResolution.y;
    
    vec3 ro = vec3(uv*5., -45.), rd = vec3(0.,0.,1.), p=ro, 
    col = vec3(0.), l=normalize(vec3(-1.,2.,-2.));

    bool hit=false;
    for (float i=0.; i<64.; i++)
    {
        float d = SDF(p);
        if(d<0.01)
        {
            hit=true;
        }
        d = max(abs(d-0.05),0.001);
        p += d*rd*.75;
    }
    float t = length(p-ro);
    
    if (hit)
    {
        vec3 n = gn(p);
        float li = max(dot(n,l),0.);
        col = vec3(0.3,0.8,0.99)*li;
    }
    
    col = mix(col, vec3(0.1,0.2,0.5),1.-exp(-0.001*t*t));
    col += g1*vec3(1.,0.3,0.);
    
    fragColor = vec4(sqrt(col),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}