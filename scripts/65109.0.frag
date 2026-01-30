/*
 * Original shader from: https://www.shadertoy.com/view/3dsBWX
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

// Emulate a black texture
#define texture(s, uv) vec4(0.0)
#define textureLod(s, uv, lod) vec4(0.0)
#define texelFetch(s, uv, lod) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
//Copyright (c) 2020 Butadiene
//Released under the MIT license
//https://opensource.org/licenses/mit-license.php

float offset = 3.6+8.5;
float sts = 0.;


mat2 rot(float r){
  return mat2(cos(r),sin(r),-sin(r),cos(r));
}


float box(vec3 p,vec3 s){
  vec3 q = abs(p);
  vec3 m = max(s-q,0.);
  return length(max(q-s,0.))-min(min(m.x,m.y),m.z);
}

float hati(vec3 p,float s){
  return dot(abs(p),normalize(vec3(1,1,1)))-s;
}

vec4 dist(vec3 p){
  vec3 sp = p;
  for(int i =0;i<4;i++){
    sp = abs(sp)-vec3(0.1,0.03,0.1);
    sp.xz *= rot(0.7);
    sp.yz *= rot(0.7);
  }
  float d2 = hati(sp,0.4);
  sp =p;
  p.xy *= rot(0.5);
  for(int i = 0;i<5;i++){
    p = abs(p)-0.3;
    p.xy *= rot(1.+(iTime*sts+offset)*0.2);
    p.xz *= rot(0.3+(iTime*sts+offset)*0.2);
    
  }
  float k = 0.2;
  p.z = mod(p.z,k)-0.5*k;
  float d= box(p,vec3(0.11,0.11,0.005));
  p =sp;
  for(int i = 0;i<5;i++){
    p = abs(p)-0.5;
    p.xy *= rot(0.7);
    p.xz *= rot(0.4);
    
  }
  k = 0.2;
  p.z = mod(p.z,k)-0.5*k;
  float d3= box(p,vec3(0.21,0.005,0.21));
  d = min(d,d3);
  
  vec3 col = vec3(0.1,0.4,0.9);
  vec3 col2 = 5.*vec3(0.7,0.1,0.3);
  float sss = 0.;
  if(d>0.2)sss=1.;
  col = mix(col,col2,step(d2,d+1.2*sss));
  return vec4(col,min(d,d2));
}

vec3 getnormal(vec3 p){
  vec2 e = vec2(0.001,0.);
  return normalize(vec3(
    dist(p+e.xyy).w-dist(p-e.xyy).w,
    dist(p+e.yxy).w-dist(p-e.yxy).w,
    dist(p+e.yyx).w-dist(p-e.yyx).w
    ));
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 r=iResolution.xy,p=(fragCoord.xy*2.-r)/min(r.x,r.y);
    
    float rs = 2.3;
    float kt = (iTime+offset)*.3;
    vec3 ro =vec3(cos(kt)*rs,rs*sin(kt*0.2+0.2),sin(kt)*rs);
    vec3 ta = vec3(0);
    vec3 cdir = normalize(ta-ro);
    vec3 side = cross(cdir,vec3(0,1,0));
    vec3 up = cross(side,cdir);
    vec3 rd = normalize(p.x*side+p.y*up+0.9*cdir);
    float d,t= 0.;
    vec4 vd;
    vec3 ac = vec3(0.);
    for(int i =0;i<77;i++){
      vd =dist(ro+rd*t);
      d = vd.w;
      t += d;
      ac += vd.xyz*exp(-2.*d);
      if(d<0.001||t>100.)break;
    }
    float skt = length(ro+rd*t);
    vec3 col = vec3(0);
    if(d<0.001){
      vec3 normal = getnormal(ro+rd*t);
      float alp = 0.3;
      float dif = pow(alp*max(dot(normal,normalize(vec3(1,1,1))),0.)+1.-0.3,2.);
      col=vec3(dif*0.4);

      t= 0.1;
      rd = reflect(rd,normal);
      vec3 ac2 = vec3(0.);
      for(int i =0;i<27;i++){
      vd =dist(ro+rd*t);
      d = vd.w;
      t += d;
      ac2 += vd.xyz*exp(-2.*d);
      if(d<0.001||t>100.)break;
      }
      if(d<0.001){
      normal = getnormal(ro+rd*t);
      alp = 0.3;
      dif = pow(alp*max(dot(normal,normalize(vec3(1,1,1))),0.)+1.-0.3,2.);
      col += 0.4*dif+0.05*ac2;

      }
    }
    col += 0.05*ac;

	fragColor = vec4(col,clamp(skt-0.6,0.,100.)/100.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}