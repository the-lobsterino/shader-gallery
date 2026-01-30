#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define tau 6.28318530718

//  Slight expansion of https://www.shadertoy.com/view/4sSyRy
//  Symetric multi smin

//  smin3 - three way smin demo by TLC123

//  https://www.shadertoy.com/view/XttyDj

//  Expandable to any n distances if efficient sorting can be found.
//  Really only the smallest 3-4 distances needs to be found to cover most cases. 

float smin(float a, float b, float k)
{
  float h = clamp(.5 + .5*(a-b)/k, 0., 1.);
  return mix(a, b, h) - k*h*(1.-h);
}
float smin3(float a, float b, float c, float k)
{
  float mini=min(a,min(b,c));
  float maxi=max(a,max(b,c));
  float medi=(a+b+c)-(mini+maxi);
//return smin( mini,smin(maxi, medi, k), k);  // combined from max to min 
  return smin( maxi,smin(mini, medi, k), k);  // gives diffrent result than from min to max
//return smin( a,smin(b,c, k), k);            // Bad 3 way smin    
}

#define f(t) length(uv-vec2(r*.5*sin(t), r*.5*cos(t)))-.1

float map(vec2 uv)
{
  float t1=time*0.4,  t2=t1+tau/3.,  t3=t1+tau*2./3.;
  float r=abs(sin(t1+5.))*0.35+0.5;
  return smin3( f(t1), f(t2), f(t3),.7);
}

void main()
{
  vec2 uv = ((2.*gl_FragCoord.xy-resolution.xy)/resolution.y)/1.4;
  float t = 1./resolution.y;
  float c = smoothstep(-t,t,map(uv))-length(uv)/8.;
  gl_FragColor = vec4(1.0-c);
}
