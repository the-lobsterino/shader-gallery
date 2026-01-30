//g
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define q vec4
float s,t;q e,d,p;void m(){p=e+d*s;s+=t=min(2.+p.y,length(mod(p.xz,2.)-1.)-.3);}void main(){e.z=-time;q k=q(1e3);d=(2.*gl_FragCoord-k)/k;for(int i=0;i<20;i++)m();e+=.1;m();gl_FragColor=q((.2*d+s*.1).xyz+t,1);}