#ifdef GL_ES
precision mediump float;
#endif
uniform float time;uniform vec2 resolution;float M(vec3 p){float r=cos(sin(p.x)
)+cos(p.y)+cos(sin(p.z));p*=25.;return r-=cos(cos(p.x)+cos(p.y)+cos(p.z))*.12;}
void main(){float k=time,q=k,f=exp(1.-fract(k+sin(k))),t=0.,dt=5.;vec3 p=vec3(0
,-k*2.-f*f,0),d=normalize(vec3(-1.+2.*(gl_FragCoord.xy/resolution),1.));d/=64.;
d.xy=vec2(d.x*cos(k)-d.y*sin(k),d.x*sin(k)+d.y*cos(k));if(mod(k,4.)<2.)d=-d.yzx
;for(int i=0;i<150;i++){if(M(t*d+p)<.9-abs(.5*sin(q*.5))){t-=(dt+.1);dt*=.1;}
t+=dt;}vec3 c=d+vec3(2,1,3.*sin(q))*M(t*d+p+.7);gl_FragColor=vec4(f*f*c*.1,4);}