#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
void main( void ) {
  vec2 snormPos;
  float aspectRatio = resolution.x / resolution.y; // アスペクト比
  snormPos.x = gl_FragCoord.x * 2.0 / (resolution.x) - 1.0; // 正規化デバイス座標(-1.0～1.0) に変換
  snormPos.y = gl_FragCoord.y * 2.0 / (resolution.y) - 1.0; // 正規化デバイス座標(-1.0～1.0) に変換
  snormPos.x *= aspectRatio;
  float c2 = cos(time)+1.5;	
  float x = snormPos.x;
  float y = snormPos.y;
  float rq = x*x + y*y;
  float mo = sin(time)*0.02+0.02;
  float e = exp(-(rq-mo)*30.0)/exp(0.0);
	
 
  gl_FragColor = vec4(e,e,e,1);
}