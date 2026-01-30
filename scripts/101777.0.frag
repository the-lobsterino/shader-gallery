/*
 * Original shader from: https://www.shadertoy.com/view/slVBWV
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

// --------[ Original ShaderToy begins here ]---------- //
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .0005
#define Rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))
#define antialiasing(n) n/min(iResolution.y,iResolution.x)
#define S(d,b) smoothstep(antialiasing(1.0),b,d)
#define B(p,s) max(abs(p).x-s.x,abs(p).y-s.y)
#define SPEED 200.
#define ZERO (min(iFrame,0))
#define MATERIAL0 0
#define MATERIAL1 1
#define MATERIAL2 2


float segBase(vec2 p){
    vec2 prevP = p;
    
    float size = 0.02;
    float padding = 0.05;

    float w = padding*3.0;
    float h = padding*5.0;

    p = mod(p,0.05)-0.025;
    float thickness = 0.005;
    float gridMask = min(abs(p.x)-thickness,abs(p.y)-thickness);
    
    p = prevP;
    float d = B(p,vec2(w*0.5,h*0.5));
    float a = radians(45.0);
    p.x = abs(p.x)-0.1;
    p.y = abs(p.y)-0.05;
    float d2 = dot(p,vec2(cos(a),sin(a)));
    d = max(d2,d);
    d = max(-gridMask,d);
    return d;
}

float seg0(vec2 p){
    vec2 prevP = p;
    float d = segBase(p);
    float size = 0.03;
    float mask = B(p,vec2(size,size*2.7));
    d = max(-mask,d);
    return d;
}

float seg2(vec2 p){
    vec2 prevP = p;
    float d = segBase(p);
    float size = 0.03;
    p.x+=size;
    p.y-=0.05;
    float mask = B(p,vec2(size*2.,size));
    d = max(-mask,d);

    p = prevP;
    p.x-=size;
    p.y+=0.05;
    mask = B(p,vec2(size*2.,size));
    d = max(-mask,d);
    
    return d;
}

vec2 combine(vec2 val1, vec2 val2 ){
    return (val1.x < val2.x)?val1:val2;
}

mat2 Rot0(vec2 p){
    return Rot(radians(90.));
}

float ring(vec3 p, float size){
    return max(abs(p.y)-1.,abs(length(p.xz)-size)-0.001);
}

vec2 GetDist(vec3 p) {
    vec3 prevP = p;
    
    p.yz*=Rot0(p.yz);
    p.xy*=Rot0(p.xy);
    float d = ring(p,0.4);
    vec2 res = vec2(d,MATERIAL0);
    
    p.z-=0.85;
    d = ring(p,0.4);
    vec2 res2 = vec2(d,MATERIAL1);
    
    p.z+=1.7;
    d = ring(p,0.4);
    vec2 res3 = vec2(d,MATERIAL2);
    
    return combine(res,combine(res2,res3));
}

vec2 RayMarch(vec3 ro, vec3 rd, float side, int stepnum) {
    vec2 dO = vec2(0.0);
    
    for(int i=0; i<MAX_STEPS; i++) {
        vec3 p = ro + rd*dO.x;
        vec2 dS = GetDist(p);
        dO.x += dS.x*side;
        dO.y = dS.y;
        
        if(dO.x>MAX_DIST || abs(dS.x)<SURF_DIST) break;
    }
    
    return dO;
}

vec3 GetNormal(vec3 p) {
    float d = GetDist(p).x;
    vec2 e = vec2(.001, 0);
    
    vec3 n = d - vec3(
        GetDist(p-e.xyy).x,
        GetDist(p-e.yxy).x,
        GetDist(p-e.yyx).x);
    
    return normalize(n);
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

vec3 tex(vec3 p, float dir){
    vec2 uv = vec2(0.9*atan(p.x,p.z)/6.2832,p.y/3.);
    uv*=1.5;
    uv.y*=-1.;
    uv.x+=iTime*0.1*dir;
    uv.x = mod(uv.x,0.3)-0.15;
    uv*=Rot(radians(90.));
    float d = seg2(uv-vec2(-0.3,0.));
    float d2 = seg0(uv-vec2(-0.1,0.));
    d = min(d,d2);
    d2 = seg2(uv-vec2(0.1,0.));
    d = min(d,d2);
    d2 = seg2(uv-vec2(0.3,0.));
    d = min(d,d2);
    
    return mix(vec3(0.0),vec3(1.8),S(d,0.0));
}

vec3 materials(int mat, vec3 n, vec3 rd, vec3 p, vec3 col){
    vec3 prevP = p;
    p.yz*=Rot0(p.yz);
    p.xy*=Rot0(p.xy);
    if(mat == MATERIAL0){
        col = tex(p,1.);        
    } else if(mat == MATERIAL1){
        p.z-=0.85;
        col = tex(p,-1.);        
    } else if(mat == MATERIAL2){
        p.z+=0.85;
        col = tex(p,-1.);        
    }

    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    vec2 m =  iMouse.xy/iResolution.xy;
    
    vec3 ro = vec3(0, 0, -1.35);
    
    vec3 rd = R(uv, ro, vec3(0,0.0,0), 1.0);
    vec2 d = RayMarch(ro, rd, 1.,MAX_STEPS);
    vec3 col = vec3(.0);
    
    if(d.x<MAX_DIST) {
        vec3 p = ro + rd * d.x;
        vec3 n = GetNormal(p);
        int mat = int(d.y);
        col = materials(mat,n,rd,p,col);
    }
    
    // gamma correction
    col = pow( col, vec3(0.9545) );    

    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}