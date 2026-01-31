precision mediump float;
uniform float time;
uniform vec2  resolution;

void main(){
  vec3 color = vec3(1.0, 0.9, 0.3);

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  float a = cos(p.y * 5.0 + time * 0.3 * (1.0+sin(time))/2.0) / 2.1;
  float b = (sin(p.y * 5.0 + time * 5.55) + sin(p.y * 9.0 + time * 12.0) + sin(p.y * 5.0 + time * 27.0))/6.0;
  float c = cos(p.y * 5.0 + time * 17.5) / 2.3;
  float d = sin(p.y * 5.0 + time * 7.0) / 2.44;

  float f = 0.01 / abs(p.x + a);
  float g = 0.01 / abs(p.x + b);
  float h = 0.01 / abs(p.x + c);
  float i = 0.01 / abs(p.x + d);

  vec3 destColor = color * f + color * g + color * h + color * i;
  gl_FragColor = vec4(destColor, 1.0);
}
