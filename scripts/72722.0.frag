/*
 * Original shader from: https://www.shadertoy.com/view/NsXSRS
 * modified
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define hash21(p) fract(sin(dot(p, vec2(122.9898, 78.2033))) * 43758.5453)

float fig(vec2 uv,vec2 offset)
{
  uv += offset;
  float d = length(uv)*9.5;
  d = smoothstep(.01,.014,d);
  float c = d;
   
  for(float i=0.;i<15.;i++)
  {
    vec2 n = uv;
    float h  = hash21(vec2(i*i*i*i,i+4.12)+offset);
    float at= atan(n.x,n.y);
    float q=length(uv)-(.120+.11118*i+sin(time/1.5+at*5.+h*h*h*h*exp(mod(i+7.,14.)))*(.01+.001*i+h*h*.908));
    q = smoothstep(.00001,.007,abs(q)-.001-sin(time+i+at*112.+h*100.)*.005+.003);
//  q = smoothstep(0., fwidth(q),abs(q)-.001-sin(time+i+at*2.+h*100.)*.005-.0001);
    d = min(d,q);
  }
  return min(c,d);
}
void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord.xy -.5* resolution.xy)/resolution.y;
    vec2 offset = vec2(-.1,.000000001);
    float d = fig(uv,offset*2./1./11./5.);
    float e = fig(uv,offset*11./5./2.);
    d = min(d,e);
    vec3 col = vec3(.1);
    col = mix( col, vec3(1.5,2.3,22410.8), (1.1-d));
    fragColor = vec4(col*col*col,11.0);
}

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}