/*
 * Original shader from: https://www.shadertoy.com/view/3lVfWz
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

// shadertoy emulation
#define iTime fract(1.+(1.-dot(surfacePosition,surfacePosition))+noyz(surfacePosition))
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
//katari by eiffie
//The Nazca Lines on hills were for people but those on plains were prayers to the gods.
//This looks like the kind of prayer I would make.
//Hey God I squared the circle give me magic powers! No you didn't.
//I doubled the cube. Not even close.
//Its a trig table. Only the easy ones are correct. What do the 22.5 degrees even point to?
//Its a chakana! Nope.
//Its the world's biggest corn hole game. Fine whatever.

#define tim iTime*1.3
#define rez iResolution.xy
// Based on a simple 2d noise algorithm contributed by Trisomie21 (Thanks!) 
float noyz(vec2 v){ 
	return fract(dot(v,v)*dot(surfacePosition,1.0-surfacePosition));//*2.0-1.0;
  vec4 h=fract(sin(vec4(floor(v.x)+floor(v.y)*1000.)+vec4(0,1,1000,1001))*1000.); 
  v=smoothstep(0.,1.,fract(v));return mix(mix(h.x,h.y,v.x),mix(h.z,h.w,v.x),v.y); 
}
float bumpz(vec2 p, float d){
  return (noyz(p)-noyz(vec2(p.x+p.y,p.x-p.y)))*d;
}
float box(vec2 p){p=abs(p);return max(p.x,p.y);}
float tbox(vec2 p){p=abs(p);return min(abs(max(p.x,p.y)-.5),abs(p.x-p.y));}
float DE(vec2 p){
  float b=box(p),r=length(p);
  float d=abs(b-4.);
  d=min(d,abs(-abs(p.x)*3.-(p.y+p.x*.2)+20.));//randoms
  d=min(d,abs(box(vec2(p.x-p.y,p.x+p.y)*.707)-4.));
  for(float i=1.;i<=4.;i+=1.)d=min(d,abs(r-i));
  vec2 ap=abs(p);
  if(ap.y>ap.x)ap=ap.yx;
  if(r<1.5){d=min(d,min(abs(ap.x-ap.y),abs(ap.x-ap.y*3.5)));}
  if(r>2.5){ap-=1.62;ap*=.83;}
  float t=tbox(fract(ap)-.5);
  ap=floor(ap);
  if(ap.x==1. && (ap.y==0. || (r>2.5 && ap.y==1.)))d=min(d,t);
  return d;
}
vec2 rotate(vec2 v, float angle) {return cos(angle)*v+sin(angle)*vec2(v.y,-v.x);}
void mainImage(out vec4 O, in vec2 U){
  vec2 uv=(2.0*U-rez)/rez;
  uv.xy*=(1.75+.5*sin(tim)+uv.y*.2);
  uv+=vec2(sin(tim*.7),sin(tim*.5))*.2;
  uv=rotate(uv,(tim+abs(sin(tim)))*1.3);
  float d=DE(uv*5.);
  d=.75-.4*pow(bumpz(uv*(30.+3.*sin(uv.yx*2.)),d),.25);
  O=vec4(vec2(d,d),d*.9,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}