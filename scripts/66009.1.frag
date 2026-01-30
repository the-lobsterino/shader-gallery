#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
void main( void ) {
  vec2 snormPos;
  float r = 0.4; // 円の半期
  float aspectRatio = resolution.x / resolution.y; // アスペクト比
  snormPos.x = gl_FragCoord.x * 2.0 / (resolution.x) - 1.0; // 正規化デバイス座標(-1.0～1.0) に変換
  snormPos.y = gl_FragCoord.y * 2.0 / (resolution.y) - 1.0; // 正規化デバイス座標(-1.0～1.0) に変換
  snormPos.x *= aspectRatio;
  if(pow(snormPos.x,2.0) + pow(snormPos.y,2.0)  < pow(r,2.0) ){ // 本当は step 関数が良いとされる
    gl_FragColor = vec4(1,0,0,1); // 赤
  }
  else
  {
    gl_FragColor = vec4(1,1,1,1); // 白
  }
}