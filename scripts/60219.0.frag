// shaven haven
precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution
varying vec2 surfacePosition;
void main(void){
  vec3 rColor = vec3(0.9, 0.0, 0.3);
  vec3 gColor = vec3(0.0, 0.9, 0.3);
  vec3 bColor = vec3(0.3, 0.3, 0.9);
  vec3 yColor = vec3(0.5, 0.5, 0.0);

  vec2 p = surfacePosition;
  float dp = p.x*p.x;
  p *= mix( dp, 1.0/dp, 0.3+sin(time)*0.15 );

  float a = sin(p.x * 15.0 + time * 2.0) / 2.0;
  float b = sin(p.x * 14.0 + time * 3.0) / 2.0;
  float c = sin(p.x * 13.0 + time * 4.0) / 2.0;
  float d = sin(p.x * 12.0 + time * 5.0) / 2.0;

  float f = 0.02 / abs(p.y + b);
  float g = 0.03 / abs(p.y + a);
  float h = 0.04 / abs(p.y + d);
  float i = 0.05 / abs(p.y + c);

  vec3 destColor = rColor * f + gColor * g + bColor * h + yColor * i;
  gl_FragColor = vec4(destColor*0.9, 1.0);
}