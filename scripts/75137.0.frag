
//https://bit.ly/3AlGbcq
precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;
void main(){
  vec2 r=resolution;
//  vec2 p=(gl_FragCoord.xy*2.-r)/min(r.x,r.y);
  vec2 p=gl_FragCoord.xy;
  p=p*2.;
  p=p-r;
  p=p/min(r.x,r.y);
  for(int i=0;i<12;++i){
    p=abs(p);
    p=p/abs(dot(p,p));
//    p=p-vec2(0.1);
    //p=p-vec2(.9+cos(0.*.2)*.4);
    p=p-vec2(.6+cos(time*.8)*.2);
//      p.xy=dot(p,p)-vec2(.9+cos(time*.2)*.4);
//      p.xy=abs(p)/abs(dot(p,p))-vec2(.9+cos(time*.2)*.4);
  }
  gl_FragColor=vec4(p.yxy,1);
}