precision mediump float;
uniform float time;
uniform vec2  resolution;

void main(){
  vec3 color = vec3(1.0, 0.5, 0.4);

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  float a = (sin(p.x*p.y * 17.0 + time*0.2) + sin(p.x*p.x * 5.0 + time * 26.0)/3.0 + sin(p.x * 5.0 + time * 11.0)/6.0 + sin(p.x*p.x + time * 16.0)/4.0)*0.15;

  float f = 0.4 / abs(abs(cos(time*0.11))*p.y+p.x*p.x*3.0 + a);

  gl_FragColor = vec4(color * f, 1.0);
}
