precision mediump float;
uniform float time;
uniform vec2  resolution;

void main(){
  vec3 color = vec3(1.0, 0.3, 16.5);

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  float a = (tan(p.x * 7.0 + time) + sin(p.x * 1.0 + time * 3.0) + sin(p.x * 1.0 + time * 12.0)+ sin(p.x * 7.0 + time * 6.0))*0.5;

  float f = 0.2 / abs(p.y*p.y*p.y*2. + a*a*a*a);

  vec3 destColor = color * f;
  gl_FragColor = vec4(destColor, 1.0);
}
