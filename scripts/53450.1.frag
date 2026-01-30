#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float t;
uniform vec2 m;
uniform vec2 r;
void main(void){
  
  //正規化。画面に合わせているので消すな
  vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
  
 float w=1.0;
 
 //サイン波
 w *= sin(length(p)*30.+t*10.);
 
 
 
 gl_FragColor=vec4(0.0,w,0.0,1.0);
}