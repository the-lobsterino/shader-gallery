/*
 * Original shader from: https://www.shadertoy.com/view/ss3SzH
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
/** 
    Shadetober 2021 @byt3_m3chanic 
    10/01/21 Crystal 
    
    Isometric and angles / some pattern illusions.
    using the bag of tricks refration/reflection.

    shadetober based off inktober 2021 found here
    https://inktober.com/rules
    
*/

#define R           iResolution
#define T           iTime
#define M           iMouse

#define PI          3.14159265359
#define PI2         6.28318530718

#define MAX_DIST    30.00
#define MIN_DIST    0.0001

mat2 rot (float a) { return mat2(cos(a),sin(a),-sin(a),cos(a)); }
float hash21( vec2 p ) { return fract(sin(dot(p,vec2(23.43,84.21))) *4832.3234); }
float lsp(float begin, float end, float t) { return clamp((t - begin) / (end - begin), 0.0, 1.0); }
float eoc(float t) { return (t = t - 1.0) * t * t + 1.0; }

//@iq sdf's!
float sdframe( vec3 p, vec3 b, float e ) {
  p = abs(p  )-b;
  vec3 q = abs(p+e)-e;
  return min(min(
      length(max(vec3(p.x,q.y,q.z),0.0))+min(max(p.x,max(q.y,q.z)),0.0),
      length(max(vec3(q.x,p.y,q.z),0.0))+min(max(q.x,max(p.y,q.z)),0.0)),
      length(max(vec3(q.x,q.y,p.z),0.0))+min(max(q.x,max(q.y,p.z)),0.0));
}
//@gaz crystal shape via twitter
float zag(vec3 p, float s) {
    p = abs(p)-s;
    if (p.x < p.z) p.xz = p.zx;
    if (p.y < p.z) p.yz = p.zy;
    if (p.x < p.y) p.xy = p.yx;
    return dot(p,normalize(vec3(s*.42,s,0)));
}

float tmod=0.,ga1=0.,ga2=0.,ga3=0.,ga4=0.,ga5=0.;
mat2 r45=mat2(0.),ry,rx;

#define SCALE .25
const float scale = 1./SCALE;
const vec2 l = vec2(scale);
const vec2 s = l*2.;
const float sl = l.x*4.;
vec2 ps4[4];

vec2 map(vec3 p) {
    vec2 res =vec2(1e5,0.);

    p.z+=ga5*sl;
    
    mat2 rz = rot(ga4*PI);
    p.xz*=rz;
    vec2 r,ip,ct = vec2(0);

    //@Shane - multi tap grid
    for(int i =0; i<4; i++){
        ct = ps4[i]/2.;              // Block center.
        r = p.xz - ct*s;             // Local coordinates. 
        ip = floor(r/s) + .5;        // Local tile ID. 
        r -= (ip)*s;                 // New local position.   
        vec2 idi = (ip*s) + ct;
 
        vec3 q = vec3(r.x,p.y,r.y);
        float chx = mod(idi.x,2.) * 2. - 1.;
        float chy = mod(idi.y,2.) * 2. - 1.;
        float chk = (chy<1. ^^ chx<1.) ? .6 : .4;
        
        if(chk>.5) { 
            q.xy*=rz; 
            q.xz*=rot(ga1*PI); 
        } else { q.zy*=rot(ga3*PI);
            q.yz*=rz; 
            q.yz*=rot(-ga5*PI);
        }

        float ms = l.x*.16;
        float mf = l.x*.27;

        float frame2 = sdframe(q,vec3(mf),.0725);
        if(frame2<res.x) res = vec2(frame2,4.);
  
        float mainbox = zag(q,ms);
        q.yz*=r45;
        q.zx*=r45;
        mainbox=max(mainbox,-zag(q,ms*.425));
    
        if(mainbox<res.x) res = vec2(mainbox,1.);

    }

    return res;
}

//Tetrahedron technique
//https://www.iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
vec3 normal(vec3 p, float t) {
    float e = t;
    vec2 h = vec2(1.0,-1.0)*0.5773;
    return normalize( h.xyy*map( p + h.xyy*e ).x + 
                      h.yyx*map( p + h.yyx*e ).x + 
                      h.yxy*map( p + h.yxy*e ).x + 
                      h.xxx*map( p + h.xxx*e ).x );
}

vec3 render(vec3 p, vec3 rd, vec3 ro, float d, float m, inout vec3 n, inout float fresnel) {
    n = normal(p,d);
    vec3 lpos =  vec3(8,10,8);
    vec3 l = normalize(lpos-p);
    float diff = clamp(dot(n,l),0.,1.);
    
    fresnel = pow(clamp(1.+dot(rd, n), 0., 1.), 9.);
    fresnel = mix(.0, .9, fresnel);

    vec3 h = vec3(.3);
    if(m==1.) h=mix(vec3(.5),vec3(0.322,0.831,1.000),clamp((p.z+8.)*.075,0.,1.));
    if(m==4.) h=mix(vec3(.9),vec3(.5),1.-clamp((p.z+8.)*.075,0.,1.));
    h = mix(h,vec3(0.322,0.831,1.000),fresnel);
    
    return diff*h;
}

const float zoom = 7.;

void mainImage( out vec4 O, in vec2 F )
{
    // precal
    float time = T;
    r45 = rot(.78539816);
    
    tmod = mod(time, 16.);
    float t1 = lsp(2.0, 4.0, tmod);
    float t2 = lsp(6.0, 8.0, tmod);
    
    float t5 = lsp(4.0, 6.0, tmod);
    float t6 = lsp(8.0, 10.0, tmod);
    
    float t7 = lsp(0.0, 2.0, tmod);
    float t8 = lsp(8.0, 10.0, tmod);
    
    float t9 = lsp(10.0, 16.0, tmod);
    
    ga1 = eoc(t1-t2);
    ga1 = ga1*ga1*ga1;

    ga3 = eoc(t5-t6);
    ga3 = ga3*ga3*ga3;
    
    ga4 = eoc(t7-t8);
    ga4 = ga4*ga4*ga4;
    
    t9 = eoc(t9);
    t9 = t9*t9*t9;  
    ga5 = (t9);
    //
    
    vec2 uv = (2.*F.xy-R.xy)/max(R.x,R.y);

    //orthographic camera
    vec3 ro = vec3(uv*zoom,-zoom-15.);
    vec3 rd = vec3(0,0,1.);

    rx = rot(.615);
    ry = rot(-.7853981);
    
    ro.zy*=rx;rd.zy*=rx;
    ro.xz*=ry;rd.xz*=ry;

    vec3 C = vec3(.0075);
    vec3  p = ro + rd;
    float atten = .95;
    float k = 1.;
    float d = 0.;
    for(int i=0;i<100;i++)
    {
        vec2 ray = map(p);
        vec3 n=vec3(0);
        float m = ray.y;

        d = i<32 ? ray.x*.2 : ray.x;
        p += rd * d *k;
        
        if (d*d < 1e-7) {
  
            float fresnel=0.;
            C+=render(p,rd,ro,d,ray.y,n,fresnel)*atten;
  
            atten *= .525;
            p += rd*.025;
            k = sign(map(p).x);

            vec3 rr = vec3(0);

            if(m== 14.) {
                rd=reflect(-rd,n);
                p+=n*.05;
            } else {
                rr = refract(rd,n,.55);
                rd=mix(rr,rd,.5-fresnel);
            }

        } 
       
        if(distance(p,rd)>35.) { break; }
    }

    if(C.r<.008&&C.g<.008&&C.b<.008) C = hash21(uv)>.85 ? C+.015 : C;
    //C = pow(C, vec3(.4545));
    O = vec4(C*vec3(0.494,0.655,0.827),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    ps4[0] = vec2(-.5, .5);
    ps4[1] = vec2(.5);
    ps4[2] = vec2(.5, -.5);
    ps4[3] = vec2(-.5);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}