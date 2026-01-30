#ifdef GL_ES
precision mediump float;
#endif
uniform float time;uniform vec2 resolution;void main(){float a=.5,b=.0,d=1000.,c
=1.,e=a+time,f=.1;vec2 g=gl_FragCoord.xy/resolution.xy-a;vec3 h=vec3(g*15.,c),i=
vec3(b),j=vec3(c,a,a);mat2 k=mat2(cos(e),sin(e),-sin(e),cos(e));h.xy*=k;j.xy*=k;
for(int l=0;l<10;l++){vec3 m=j+f*h*a;m=abs(vec3(.8)-mod(m,vec3(1.6)));float n,o=
n=b;for(int p=0;p<20;p++){m=abs(m)/dot(m,m)-a;o+=abs(length(m)-n);n=length(m);}
float q=max(b,.3-o*o/d);o*=o*o;if(l>6) c*=c-q;i+=c;i+=vec3(f,f*f,f*f*f*f)*o*c/d;
c*=.7;f+=.1;}i=mix(vec3(length(i)),i,.8);gl_FragColor=vec4(i*.01,c);}
