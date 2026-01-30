/*
 * Original shader from: https://www.shadertoy.com/view/cld3z2
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
mat3 transpose(const in mat3 m)
{
    return mat3(
        m[0][0], m[1][0], m[2][0],
        m[0][1], m[1][1], m[2][1],
        m[0][2], m[1][2], m[2][2]);
}

// --------[ Original ShaderToy begins here ]---------- //
#define T iTime

vec3 hash(float n)
{
  vec3 p=fract(vec3(n)*vec3(.1031,.103,.0973));
  p+=dot(p,p.zxy*33.33);
  return fract((p.xxy+p.yzz)*p.yxz);
}

vec3 Q(float t,float a,float b)
{
  float i=floor(t);
  float f=fract(t);
  return mix(hash(i),hash(i+1.),smoothstep(a,b,f));
}

#define H(h)(cos((h)*6.3+vec3(0,21,23))*.5+.5)

vec3 R(vec3 p,vec3 a,float t)
{
  a=normalize(a);
  return mix(a*dot(p,a),p,cos(t))+sin(t)*cross(p,a);
  
}

vec2 M(vec2 p, float n)
{
  float a=asin(sin(atan(p.y,p.x)*n))/n;
  return vec2(cos(a),sin(a))*length(p);
}

vec3 trap;
float map(vec3 p)
{
  p=asin(sin(p/3.)*.997)*3.;
  p=R(p,vec3(1),T);
  p+=cross(sin(p*.3),cos(p*.4));
  p.xy=M(p.xy,10.);
  p.x-=2.;
  p.zx=M(p.zx,3.);
  p.z-=.5;
  p.z=asin(sin(p.z*3.))/3.;
  trap=p;
  vec3 q=p;
  p-=clamp(p,-.1,.1);
  q-=clamp(q,-.01,.01);
  float de=1.;
  //de=min(de,dot(p,normalize(vec3(1,2,3)))-.003);
  de=min(de,length(p)-.01);
  de=min(de,length(vec2(length(p.xy)-.3,p.z))-.05);
  de=min(de,length(vec2(length(p.zy)-.2,p.x))-.08);
  
  
  
  de=min(de,length(q.xy)-.03);
  de=min(de,length(cross(p,normalize(H(.1))))-.05);
  return abs(de)+.001;
}

#define E(a)vec3(cos(a.y)*cos(a.x),sin(a.y),cos(a.y)*sin(a.x))
mat3 lookat()
{
  //return mat3(1);
    vec3 w=E(3.*Q(T*.3,.1,.3));
  vec3 u=cross(w,vec3(0,1,0));
  return mat3(u,cross(u,w),w);

}

vec3 eye()
{
  //return vec3(0,0,-5);
  return Q(T*.3,.7,.9)+vec3(0,0,T*3.);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord)
{
  vec2 uv=(fragCoord-.5*iResolution.xy)/iResolution.y;
  float n=gl_FragCoord.x+gl_FragCoord.y*iResolution.y;
  vec3 O=hash(n)*.1;
  O+=Q(n*.03,0.,1.).xxx*.1*dot(uv,uv);
  vec3 rd=lookat()*normalize(vec3(uv,.5));
  float g=0.,e;
  for(float i=0.;i<100.;i++)
  {
    vec3 p=rd*g+eye()-i/1e4;
    g+=e=map(p)*.8;
    O+=mix(vec3(1),H(trap.y*3.),.8)*.05/exp(i*i*e);
  }
  
  O*=
  transpose (
  mat3(
  hash(1776.),
  hash(64223.),
  hash(132333.)
  ));
  
  fragColor.xyz = O*O*O;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}