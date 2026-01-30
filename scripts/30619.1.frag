//---------------------------------------------------------
// Shader:   JellyBrot.glsl  by Kali in 2015-08-27
// original: https://www.shadertoy.com/view/4lsSW2
// Tags:     3d, fractal, volumetric, rotate
//           ported to glslsandbox I.G.P 
//---------------------------------------------------------

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define iterations 25
#define deep_steps 50.0

float t=time*.04;

float sphere(vec3 p, vec3 rd, float r)
{
  float b = dot( -p, rd );
  float inner = b * b - dot( p, p ) + r * r;
  if( inner < 0.0 ) return -1.0;
  float s=sqrt(inner);
  return b - s;
}


mat2 rot(float a) 
{
  float c=cos(a), s=sin(a);
  return mat2(c,s,-s,c);
}

vec3 kset(in vec3 p)
{
  p+=sin(p*100.+time*8.)*.0005;
  p*=.74;
  p=abs(1.-mod(p,2.));
  vec3 cp=vec3(0.);
  float c=1000.;
  for (int i=0; i<iterations; i++)
  {
    float dd=dot(p,p);
    vec3 p2=p;
    p=abs(p);
    p=p/dd-1.;
    cp+=exp(-50.*abs(p-p2*.5));
    c=min(c,dd);
  }
  c=pow(max(0.,.2-c)/.2,5.);
  return cp*.03+c*.3;
}

void main( void )
{
  vec2 uv = gl_FragCoord.xy / resolution.xy-.5;
  uv.x *= resolution.x / resolution.y;
  vec2 mo=mouse;
  vec3 ro=vec3(mo.x-0.5, mo.y-0.5,-2.2-sin(t*3.7562)*.3);
  vec3 rd=normalize(vec3(uv,1.));
  vec3 v=vec3(0.);
  float x=mo.x*2.+t; float y=mo.y*3.+t*2.;
  mat2 rot1=rot(x);
  mat2 rot2=rot(y);
  float f=1.;
  rd.xy*=rot(.3);
  ro.xy*=rot(.3);
  ro.xz*=rot1;
  rd.xz*=rot1;
  ro.yz*=rot2;
  rd.yz*=rot2;
  float c=0.;
  for (float i=0.; i<deep_steps; i++) 
  {
    float tt=sphere(ro, rd, 1.0-i*.002);
    vec3 p=ro+rd*tt;
    vec3 n=normalize(rd-ro);
    vec3 k=kset(p)*step(0.,tt)*f;
    v+=k*pow(max(0.,dot(rd,n)),8.);
    f*=max(0.5,1.-length(k)*3.5);
  }
  gl_FragColor = vec4(mix(vec3(length(v))*vec3(1.2, 1.1, 0.8),v, .6), 1.0);
}
