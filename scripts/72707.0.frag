/*
 * Original shader from: https://www.shadertoy.com/view/fdSSRz
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
#define STEPS 164.0
#define MDIST 300.0
#define pi 3.1415926535
#define rot(a) mat2(cos(a),sin(a),-sin(a),cos(a))

vec3 glow = vec3(0);
float box(vec3 p, vec3 s){
    vec3 d = abs(p)-s;
    return max(d.x,max(d.y,d.z));
}

vec2 map(vec3 p){
    vec3 po = p;
    //p.xy*=rot(iTime);
    //p.yz*=rot(iTime);
    //p.zx*=rot(iTime);
    vec2 a = vec2(box(p,vec3(0.3)),1.0);
    
    glow+=vec3(1.000,0.067,0.090)*0.01/(0.01+a.x*a.x);
    
    
    //a = (a.x>b.x)?b:a;
    vec2 b = vec2(box(p-vec3(1,0,0),vec3(0.5)),2.0);
    a = (a.x>b.x)?b:a;
    b = vec2(box(p-vec3(-1,0,0),vec3(0.3)),3.0);
    a = (a.x>b.x)?b:a;
    
    //a.x = min(a.x,b.x);
    return a;
}

vec2 map2(vec3 p){
    vec3 po = p;
    float t = iTime;

    for(float i=0.0;i<3.0;i++){
        p=abs(p)-.3;
        p.xy*=rot(0.5+t);
        p.xz*=rot(0.5+t);
    }
    vec2 a = map(p);
    a.x = box(po,vec3(1.5));
    a.x = min(a.x,length(po)-2.0);
    vec2 b = vec2(po.y+1.8,2.0);
    //a = (a.x>b.x)?b:a;
    
    return a;
}
vec2 map3(vec3 p){
    vec3 po = p;
    float t = iTime;
    
    vec2 a = map2(p);
    
    for(float i=0.0;i<9.0;i++){
        p=abs(p)-vec3(2.3*i,1,1);
        p.xy*=rot(pi/4.0*floor(t*3.0));
        p.xz*=rot(pi/7.0*floor(t*3.0));
        a = min(a,map2(p*0.5));
    }
        
    //a.x = box(po,vec3(1.5));
    //a.x = min(a.x,length(po)-2.0);
    vec2 b = vec2(po.y+1.8,2.0);
    a = (a.x>b.x)?b:a;
    
    po=mod(po,80.0)-40.0;
    a.x = min(a.x,length(po.xz)-2.0);
    a.x = min(a.x,length(po.zy)-2.0);
    a.x = min(a.x,length(po.xy)-2.0);
    return a;
}

vec3 norm(vec3 p){
    vec2 e = vec2(0.01,0.0);
    return normalize(map3(p).x-vec3(
    map3(p-e.xyy).x,
    map3(p-e.yxy).x,
    map3(p-e.yyx).x));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-0.5*iResolution.xy)/iResolution.y;
    vec3 col = vec3(0);
    
    vec3 ro = vec3(0,30,-90);
    vec3 rd = normalize(vec3(uv,1.0));
    rd.zy*=rot(0.3);
    ro.xz*=rot(iTime);
    rd.xz*=rot(iTime);
    vec3 p = ro;
    float dO = 0.0;
    float shad = 0.0;
    float bnc = 0.0;
    float dist = 0.0;
    float dO2;
    for(float i = 0.0; i<STEPS; i++){
        p = ro + rd * dO;
        vec2 d = map3(p);
        dO += d.x;
        dO2+= d.x;
        if(dO2>MDIST || d.x < 0.01) {
            shad = float(i)/(STEPS);
            if(bnc == 0.0)dist=dO;
            if(bnc== 1.0||d.y!=2.0) {shad=i/STEPS; break;}
            ro += rd*dO;
            vec3 n = norm(ro);
    
            rd = reflect(rd,n);
            ro += n*0.1;
            dO = 0.0;
            //i=0.0;
            bnc++;
        }
    }
    col = vec3(shad);
    //col += 0.5*mix(vec3(0.176,0.259,1.000),vec3(0.722,0.067,1.000),sin(p.z*0.01));
    col+=glow*0.2;
    col=mix(col,vec3(0),(dist/MDIST));
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}