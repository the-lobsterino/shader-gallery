precision highp float; 
uniform vec2 resolution;
uniform vec4 mouse;
uniform float time;
const float pi = 3.141592653589793;

float hash(float x) {
    return fract(sin(x) * 43758.23);
}

void main() { 
  vec2 p = gl_FragCoord.xy / resolution;
  p = 2.0 * p - 1.0;
  p.x *= resolution.x / resolution.y;
  
  float col = 0.0;
  vec2 q = vec2(0.0);
  
  for(int i = 0; i < 10; i++) {
    float t = mod(time, 3.0) / 3.0;
    float vel = hash(float(i));
    q.y = float(i) / 10.0 - 0.5;
    q.x = vel * t;
    float d = length(p - q) - 0.02;
    float c = smoothstep(0.01, 0.0, d);
    col = mix(col, 0.5, c);
  }
  gl_FragColor = vec4(vec3(col), 1.0);
}