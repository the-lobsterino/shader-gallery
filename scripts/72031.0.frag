precision mediump float;
uniform float time;
uniform vec2 resolution;
void main(){
  vec2 p=(gl_FragCoord.xy*2.0-resolution)/min(resolution.x,resolution.y);
  float t=8./abs(0.4-0.6*length(p)+0.01);
  gl_FragColor=vec4(sin(1.2*t*time),cos(1.3*t*time),t*time,1.0);
}