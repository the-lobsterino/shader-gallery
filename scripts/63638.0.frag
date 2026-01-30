/*
 * Original shader from: https://www.shadertoy.com/view/Xd2BzW
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

// --------[ Original ShaderToy begins here ]---------- //
float C = 0., S = 0.;
#define rot(a) mat2(C=cos(a),S=sin(a),-S,C)
#define TAU 6.28318531

struct I{vec3 c;float l,m;};
    
float smin(float a, float b, float k){
	float h=clamp(.5+.5*(b-a)/k,0.,1.);
    return mix(b,a,h)-k*h*(1.-h);
}

float rd(vec2 p) {
    return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453123);
}

float noise(vec2 uv) {
    vec2 iuv=floor(uv),
        fuv=smoothstep(0.,1.,fract(uv)),
        oi=vec2(0.,1.);
    float n00=rd(iuv),
        n01=rd(iuv+oi.xy),
        n10=rd(iuv+oi.yx),
        n11=rd(iuv+oi.yy);
    return mix(
        mix(n00,n10,fuv.x),
        mix(n01,n11,fuv.x),
        fuv.y);
}

vec2 uv=vec2(0.);
float sms=0.,t=0.,ct=0.,a=0.;
I swirl(float ao,vec3 c0,vec3 c1){
    I i;
    float 
        ta=-20.*ct*ct+ao,
        dta=mod(ta-a+.25*TAU,TAU)-.25*TAU,
        cdta=max(dta,0.),
        pa=ta-cdta,
        majr=.25+(3.+.5*cdta+.5*noise(vec2(pa*3.,iTime)))*ct*ct,
        minr=.25+(1.+.5*noise(vec2(pa*3.,iTime+10.)))*ct*ct;
    vec2 p=majr*vec2(cos(pa),sin(pa)),
        pt=majr*vec2(cos(ta),sin(ta));
    float l=distance(uv,p),
        lr=1.-l/minr-smoothstep(0.,.75*TAU,cdta)*(1.-exp(ct));
    i.l=mix(TAU,cdta,smoothstep(-sms,0.,lr));
    i.m=smoothstep(-sms,-cdta*ct,lr);
    i.c=mix(c0,c1,5.*lr*(.8-t)*max(.8-t,0.));
    return i;
}

float square(vec2 p,vec2 b)
{
    vec2 d=abs(p)-b;
    return min(max(d.x,d.y),0.)+length(max(d,0.));
}

float trigram(float a,bool b0,bool b1,bool b2){
    vec2 st=rot(a)*uv;
    float d0=square(st-vec2(19./24.,0.),vec2(1./24.,.25));
    if (b0) d0=max(d0,1./48.-abs(st.y));
    float d1=square(st-vec2(22./24.,0.),vec2(1./24.,.25));
    if (b1) d1=max(d1,1./48.-abs(st.y));
    float d2=square(st-vec2(25./24.,0.),vec2(1./24.,.25));
    if (b2) d2=max(d2,1./48.-abs(st.y));
    return min(min(d0,d1),d2);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	uv = (fragCoord.xy -.5* iResolution.xy)*2./iResolution.y;
    sms=4./iResolution.y;
    t=fract(iTime/6.);
    ct=min(t-.8,0.);
    a=atan(uv.y,uv.x);
    float a23=atan(2.,3.);
    I ir=swirl(TAU*.5-a23,vec3(.77647,.04706,.18824),vec3(1.,.3,.1)),
        ib=swirl(-a23,vec3(.0,.20392,.47059),vec3(.0,.4,.8));
    float h=clamp(.5+.5*(ib.l-ir.l),0.,1.);
    vec3 c=mix(
        mix(ib.c,ir.c,h),
        mix(mix(ir.c,ib.c,ib.m),mix(ib.c,ir.c,ir.m),h),
        exp(20.*ct));
    float m=max(ib.m,ir.m);
    float d=min(
        min(
            trigram(-a23,true,false,true),
            trigram(a23,true,true,true)
        ),
        min(
            trigram(.5*TAU-a23,false,true,false),
            trigram(.5*TAU+a23,false,false,false)
        )
    );
	vec3 bg=vec3(1.-t*t/.64*smoothstep(-ct,ct-sms,d));
    c=mix(bg,c,m);
	fragColor = vec4(c,1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}