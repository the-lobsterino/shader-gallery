/*
 * Original shader from: https://www.shadertoy.com/view/cslXR7
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
const vec4 iMouse = vec4(0.);

// Emulate a black texture
#define texture(s, uv) vec4(0.0)

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //
/** 
    License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
    
    Neon Sliced Gyroid - Dream Flight & Neon Lights
    11/20/22 | @byt3_m3chanic

    Somewhat abstract and organic field sliced into ribbons based
    on @smjtyazdi formula listed below. Added an etra iteration to 
    clear up some backside artifacts in the sdf. 

    my original shader which has a polar warp and pretty forward
    camera track > https://www.shadertoy.com/view/dssXzN both 
    about the same visually - but I like the cameara motion in this
    version. Using a few sin/cos time based formulas to simulate 
    some wander/drag though the gyroid space.
    
    @smjtyazdi https://twitter.com/smjtyazdi/status/1484828390104485896

*/

#define R     iResolution
#define T     iTime
#define M     iMouse
#define PI    3.14159265358
#define PI2   6.28318530718

mat2 rot(float a) {return mat2(cos(a),sin(a),-sin(a),cos(a));}
float hash21(vec2 a){ return fract(sin(dot(a,vec2(22.34,35.34)))*483434.);}

float box(vec2 p, vec2 b){
    vec2 d = abs(p)-b;
    return length(max(d,0.))+min(max(d.x,d.y),0.);
}

//globals
mat2 trot;
float glo1=0.,slo1=0.,glo2=0.,slo2=0.;
const float ofx = 1.125;

float gyroid(vec3 p, float s, float t, float b) {
    p *= s;
    return abs(dot(sin(p*ofx),cos(p.zxy))-b)/(s*ofx)-t;
}

vec2 map(vec3 p) {
    vec2 res =vec2(1e5,1.);

    p.xy *= trot;
    p.yz += vec2(-1.25, -T);
    
    float m1 = 4.85+4.75*sin(T*.15);
    float m2 = 5.85+5.75*cos(T*.35);
    
    float d = .65, mf = 1e5;
    for(float j=-1.;j<2.;j++){
        vec3 nf =p;
        nf.z=round(nf.z/d+j)*d;
 
        float idx = mod(nf.z+5.,10.);
        float idy = mod(nf.z,12.);

        float fd = gyroid(nf, .75, .0, .525);
        fd=abs(fd)-.045;
        nf.z=clamp(p.z,nf.z-d/3.5,nf.z+d/3.5);
        fd=length(vec2(max(.0,fd), nf.z-p.z));

        if(idx<m1+.15&&idx>m1) slo1+=.002/(.015+fd*fd);
        if(idy<m2+.15&&idy>m2) slo2+=.002/(.015+fd*fd);
   
        mf=min(mf,fd);
    }
    if(mf<res.x) res=vec2(mf,3.);
    return res;
}

vec3 normal(vec3 p, float t){
    vec2 e=vec2(t*1e-4,0.);
    float d = map(p).x;
    vec3 n = d-vec3(
        map(p-e.xyy).x,
        map(p-e.yxy).x,
        map(p-e.yyx).x
    );
    return normalize(n);
}

vec3 topLayer(in vec3 C, in vec2 uv) {
    float ft = floor(T);
    uv*=rot(.05);
 
    float d = box(uv-vec2(.075,.0),vec2(.85,.4))-.01;

    vec2 pv = uv*2.;
    
    float md = floor((pv.y+.05)/.1);
    float mf = mix(hash21(vec2(ft)+md),hash21(vec2(ft+1.)+md),pow(smoothstep(0.,1.,fract(T)), 22.))*.22;
    
    pv.y=mod(pv.y+.05,.1)-.05;
    float ff=.075;
    float e = box(pv+vec2(1.75-ff,.0),vec2(.15+ff,.025))-.01;
    float ex = box(pv+vec2(1.89-mf,.0),vec2(mf,.015))-.005;
    
    float px = 4./R.x;
    float ei = smoothstep(px,-px,abs(e)-.002);
          ex = smoothstep(px,-px,ex);
          e  = smoothstep(px,-px,e);
          
    px = 2./R.x;
    float c = smoothstep(px,-px,d);
          d = smoothstep(px,-px,abs(abs(d)-.005)-.00125);
    
    uv.x-=T*.05;
    
    vec2 f=fract(uv*25.*rot(-.78))-.5;
    
    C=mix(C,C.xxx*.15,1.-c);
    if(mod(f.x,2.)<1.) C=mix(C,C+vec3(.015),1.-c);
    C=mix(C,vec3(1),d);
    if(abs(md)<6.5) C=mix(C,vec3(.001),e);
    if(abs(md)<6.5) C=mix(C,mix(vec3(.0,.09,.3),vec3(.52,.09,.58),clamp((uv.y+.25)*2.,0.,1.)),ex);
    if(abs(md)<6.5) C=mix(C,vec3(1),ei);

    return C;
}

void mainImage( out vec4 fragColor, in vec2 F )
{
    //precal
    trot = rot(T*.072);
    
    //set uv
	vec2 uv = (2.*F.xy - R.xy)/max(R.x,R.y);
    vec2 vv=uv;

	vec3 C = vec3(0);
    vec3 ro = vec3(0,0,.15),rd = normalize(vec3(uv, -1.0));

    const float dof = .001;
    const float dofdist = 1./15.;
    vec2 off=vec2(0);
    
    //mouse
    float x = M.xy == vec2(0) || M.z < 0. ? 0. : -(M.y/R.y * 1. - .5) * PI;
    float y = M.xy == vec2(0) || M.z < 0. ? 0. : -(M.x/R.x * 1. - .5) * PI;

    mat2 rx = rot(x),ry = rot(M.z < 1.?y+1.725*sin(PI*sin(T*.07)):y);

    ro.yz *= rx;ro.xz *= ry;
    rd.yz *= rx;rd.xz *= ry;
   
    //loop
    float fa=0.;
    for(int k=0;k<2;k++){
    
        vec3 p = ro;
        float d = 0., m = 0.;
        vec3 RC = vec3(0);
        
        for(int i=0;i<172;i++){
            
            //modified jitter/dof 
            //inspiration @Nusan https://www.shadertoy.com/view/3sXyRN
            if(mod(float(i),2.)<1.){
                off= texture(iChannel1,F.xy/1024.).rg*2.-1.;
                vec2 focus = off*dof;
                ro.xy+= focus*(d)*.01;
                rd.xy+= focus*(d*d)*dofdist*.01;
            }

            p=ro+d*rd;
            vec2 ray = map(p);
            m=ray.y;
            d+= i<82?ray.x*.4:ray.x*.8;
            if(ray.x<d*1e-3||d>40.)break;
        }

        if(k==0) {fa=d;glo1=slo1;glo2=slo2;}
        
        if(d<40.) {
            vec3 n = normal(p,d);
            vec3 l = normalize(vec3(-2,15,-10)-p);
            float spec = .45 * pow(max(dot(normalize(p-ro),reflect(l,n)),0.),24.);
            RC += vec3(.0) +spec;  
    
            ro = p+n*.001;
            rd = reflect(rd,n);
        }

        if(k>0) RC *=.3;
        C += RC;

    }
    
    float sp = .2+.2*sin(uv.x*4.2+T*.2);
    vec3 fog = mix(vec3(.20,.52,.85),vec3(.69,.16,.77),clamp((uv.y+.5-sp),0.,1.));

    C = mix(C,vec3(glo1*.125,glo1*.55,glo1),clamp(glo1,.0,.6));
    C = mix(C,vec3(glo2,glo2*.125,glo2*.75),clamp(glo2,.0,.8));
    C = mix(C,fog, 1.-exp(-.00015*fa*fa*fa));
    
    C = topLayer(C, uv);
    C = clamp(C,vec3(0),vec3(1));
    
    //gamma + out
    C = pow(C,vec3(.4545));
	fragColor = vec4(C,1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}