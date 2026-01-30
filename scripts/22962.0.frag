#ifdef GL_ES
precision mediump float;
#endif
uniform float time;uniform vec2 resolution;void main(){vec2 R=resolution,P=2./R
.y*gl_FragCoord.xy-vec2(R.x/R.y,1);vec3 C=vec3(0);for(float i=2.;i<9.;++i){
float T=time,t=mod(T*.4,1e3)*i,x=P.x-cos(t)*.7,y=P.y-sin(t)*.7,r=t*3.+x*tan(t*
1.5)+y*tan(t*2.),s=sin(r),c=cos(r);vec2 d=(2.+cos(T*.06)*.35-abs(vec2(sin(t*.5)
,cos(t*.5))))*vec2(x*c+y*s,x*s-y*c);t=dot(d,d)-.12;vec3 u=mod(T*vec3(2,1.9,1.8)
,1e3)*(i*.1+2.),v=vec3(sin(u.x),cos(u.y),sin(u.z+.8));C+=v*v*.02/abs(t);if(t<.0
)C+=.2*sin(u)+.1;}gl_FragColor.xyz=C;}