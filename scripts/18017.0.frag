#ifdef GL_ES
precision mediump float;
#endif
uniform float time;uniform vec2 resolution;float t=time,e=.1,v=20.;float S(vec3
p){p.z-=v;return length(p)-6.+sin(t)*sin((acos(p.y/length(p))+t)*v)*cos((acos(p
.x/length(p.xz)))*v);}void main(){vec3 n,l,D,P=vec3(0),o=vec3(-gl_FragCoord.xy/
resolution.xy+vec2(.5),1.);o.y*=resolution.y/resolution.x;D=normalize(o-P);for(
int i=0;i<64;i++)o+=S(o.xyz)*.4*D;n=normalize(vec3(.0,S(o+vec3(e)),S(vec3(0,0,e
)+o))-S(o)),l=vec3(4.*cos(t),0,4.*sin(t))-o;gl_FragColor=vec4(vec3(vec3(sin(t*
.7),sin(t),cos(t*.3))*(dot(l,n)+pow(dot(reflect(-l,n),P-o),.1))/length(l)),1);}