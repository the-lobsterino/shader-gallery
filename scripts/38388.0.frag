#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float b=time,g,v,q;vec4 s(vec2 v){g=length(v);q=abs(sin((atan(v.g,v.r)-g+b)*9.)*.1)+.1;
return min(vec4(1.),vec4(.05/abs(q-g/3.),.04/abs(q-g/2.),.03/abs(q-g*.7),1.));}
float n(vec3 v){return 1.-dot(abs(v),vec3(0.,1.,0.))-length(s(v.rb).rgb)/2.*sin(b*2.)+
(sin(5.*(v.b+b))+sin(5.*(v.r+b)))*.1;}void main(){vec3 m=vec3(-1.+2.*(gl_FragCoord.rg/
resolution),1.),a=vec3(0.,0.,-2.);for(int r=0;r<55;r+=1)g=n(a+m*v),v+=g*.125;
gl_FragColor=vec4(v/2.)*s((v*m+a).rb)+v*.1*vec4(1.,2.,3.,4.)/2.*n(v*m+a);}