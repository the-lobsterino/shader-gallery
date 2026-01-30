/*
 * Original shader from: https://www.shadertoy.com/view/ttyyWV
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

mat2 rot( float t){ float c  = cos(t);float s = sin(t); return mat2(c,-s,s,c);}
float hs(vec2 t){return fract(sin(dot((t),vec2(265.,45.)))*7845.265+iTime);}
float rd(float t){return fract(sin(dot(floor(t),45.))*7845.265);}
float no(float t){return mix(rd(t),rd(t+1.),smoothstep(0.,1.,fract(t)));}
float it(float t){float r= 0.; float a =0.5; for(int i = 0 ; i < 3 ; i++){
  r += no(t/a)*a;a*=0.5;}return r;}
  vec3 rer (vec3 p, float r){float at = atan(p.z,p.x);float t = 6.28/r;
    float a = mod (at,t)-0.5*t;
    vec2 v  = vec2(cos(a),sin(a))*length(p.xz);
    return vec3(v.x,p.y,v.y);}
    float cap (vec3 p , vec3 a, vec3 b){vec3 pa =p-a; vec3 ba = b-a;
      float h = clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
      return length(pa-ba*h);}
      
    float no(vec3 p){vec3 f = floor(p); p = smoothstep(0.,1.,fract(p));
      vec3 se = vec3(5.,48.,958.);
      vec4 v1 = dot(f,se)+vec4(0.,se.y,se.z,se.y+se.z);
      vec4 v2 = mix(fract(sin(v1)*7845.236),fract(sin(v1+se.x)*7845.236),p.x);
      vec2 v3 = mix(v2.xz,v2.yw,p.y);
      return mix(v3.x,v3.y,p.z);}
      float fmb (vec3 p ) {return smoothstep(0.1,1.,no(p+no(p)*8.));}
  float zl (vec3 p,float m1){
p = rer(p,4.);
    
    return smoothstep(pow(length(p.y),1.5)*0.4+3.,0.,length(p.xz))*3.+smoothstep(3.+m1*5.,0.,length(p))*15.+smoothstep(0.7,0.1,length(p.zy))*7.;}
  
    float zo (vec3 p, float t,float m1){
      vec3 p2 = p;
       p.xz *= rot(iTime*-4.+p.y*1.5*t*sign(p.y));
      float tt = no(p*2.5);
p.y += sin(p.x+p.z+iTime*3.);
     p.y =  abs(p.y);
      p = rer (p,4.);
      return smoothstep(0.,tt,cap(p+vec3(-tt*2.-t,0.,0.),vec3(0.,2.,0.),vec3(0.,10.,0.)))*smoothstep(0.1+m1*2.5,0.7+m1*2.,length(p2));}
float map (vec3 p){
vec3 b = p;
for (int i = 0 ; i <11 ; i++){
b = vec3(1.8)*abs(b/dot(b,b))-vec3(0.7,0.3,0.6);}
 
float v1 = length(p)-6.;
float v2 = length(b)-0.5;
return v2;}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
     uv -= 0.5;
     uv *= 2.;
     uv.x *= iResolution.x/iResolution.y;
     float time = iTime;
   float v1 = it(time*4.)*1.1;
  float v2 = it(time*1.2)*6.28;
  float v3 = it(time*1.1)*1.3;
  float v4 = it(time*1.3); 
  float v5 =  it(time*2.);
  float m1 = max(smoothstep(0.4,0.7,it(time*0.7)),0.);
 // float m2 = fract(time);
  vec3 e = vec3(0.,0.,mix(-5.5,0.,m1));
  vec3 r = normalize(vec3(uv,1.+v4));
  e.xz *= rot(v2);
   r.xz *= rot(v2);
  e.yz *= rot(v3);
   r.yz *= rot(v3);
  int va = int(mix(25.,0.,m1));
  float fstp = 10./float(va);
  vec3 fr = fstp*r;
  float prog  = fstp*hs(uv);
  vec3 lp = e+r*prog;
  float val; float opa =1.;
  for(int i = 0 ; i < 25 ; i++){
    if (i>=va){break;}
    if (prog> 10.){break;}
    if(opa<0.01){break;}
    vec3 lp2 = lp;
    lp2.xz *= rot(lp.y);
    opa *= zo(lp,v5,m1)*mix(0.95,1.,fmb(lp2*2.));
    val += zl(lp,m1)*opa;
    lp += fr;
    prog += fstp;
  }
  float c1 = val*0.02*v1;
  c1 += opa*0.2;
  vec3 e2 = vec3(0.,0.,-85.);
   e2.xz *= rot(v2);
  
  e2.yz *= rot(v3);
  vec3 p = e2;
  float dd = 0.; 
  int va2 =int(mix(0.,64.,m1));
  for (int i = 0 ; i < 64 ;i++){
    if (i>=va2){break;}
    float d = map(p);
    if(d<0.01){break;}
    p += r*d;
    dd += d;
  }
  float s1 = smoothstep(30.,80.,dd);
  float r1 = mix(c1,s1,m1);
  vec3 c2 = mix(vec3(1.),3.*abs(1.-2.*fract(r1*0.7+0.3+length(uv)*0.2+vec3(0.,-1./3.,1./3.)))-1.,0.15)*r1;
    fragColor = vec4(c2,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}