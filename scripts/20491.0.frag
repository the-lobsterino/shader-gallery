precision highp float; 
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
const float pi = 3.141592653589793;

float sdCapsule(vec2 p, vec2 a, vec2 b, float r) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - h * ba) - r;
}

void main() { 
  vec2 p = gl_FragCoord.xy / resolution;
  p = 2.0 * p - 1.0;
  p.x *= resolution.x / resolution.y;
  vec2 ms = mouse.xy * 2.0 - 1.0;
  ms.x *= resolution.x / resolution.y;
  vec3 col = vec3(0.0);
  vec2 z = p;
  vec2 w = z;
  for(int i = 0; i < 20; i++) {
    if(mod(float(i), 10.0) == 0.0) {
        w = abs(z);
    }
    z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + ms;
    col.r = sdCapsule(p, z, w, 0.01);
  }
  col.r = smoothstep(0.01, 0.0, col.r);
  col.g = length(z);
  col.b = length(w);
  gl_FragColor = vec4(col, 1.0);
}