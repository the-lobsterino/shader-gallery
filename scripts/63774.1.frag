#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
#define t time
#define r resolution

void main(){vec2 c,i,f,p,s=5.*(gl_FragCoord.xy-.5*r)/r.y;i=floor(s);f=fract(s);p=.5+.5*sin(t+6.*fract(sin(vec2(dot(i,vec2(7,3)),dot(i,vec2(9,3))))*9.));c=(1.-step(.03,length(p-f))+step(.99,f.x)+step(.99,f.y))*sin(t+p*9.);gl_FragColor=vec4(c*cos(t+p),c*sin(t+p.y));}