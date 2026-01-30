//massive anus
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c){
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(void){
  vec2 p = (gl_FragCoord.xy * 2. -resolution) / resolution.y;
	p.x += sin(time);
	p.y += cos(time);
  vec2 pos = mod(p * 15.0, 2.0 )-1.0;
  vec3 c = vec3(0.0);
  vec3 circles = vec3(0.0);
  vec3 color = vec3(0.0);
  for(int i = 0; i < 5; i++){
    c = hsv2rgb(vec3(length(p - time / 217.7 * float(i)), 0.7, 0.9));
    float dist_squared = dot(pos * pos, pos * pos);
    float t = 1.0 - length(dist_squared);
    t = pow(t, 3.0);
    circles = (dist_squared < 0.99) ? vec3(t): vec3(0.0, 0.0, 0.0);
    color = min(c, circles);
  }  

  gl_FragColor = vec4(color, 1.0);
}