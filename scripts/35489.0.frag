#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
const float pi = 3.141592653589793;

#define CS(N) (0.5*cos(N*time) + 0.5)

float map(vec2 p) {
  float a = atan(p.y, p.x) / pi * 0.5 + 0.5;
  vec2 m = mouse*2.0 - 1.0;
  m.x *= resolution.x/resolution.y;
  float d = length(p - m);
  float col = abs(sin(a * pi * 5.0*m.y + d*m.x + time));
  return col;
}

vec3 calcNormal(vec2 p) {
    vec2 e = vec2(0.001, 0.0);
    vec3 nor = vec3(
        map(p + e.xy) - map(p - e.xy),
        map(p + e.yx) - map(p - e.yx),
        map(p) * 0.05
    );
    return normalize(nor);
}

void main() { 
  vec2 p = gl_FragCoord.xy / resolution;
  p = 2.0 * p - 1.0;
  p.x *= resolution.x / resolution.y;
  vec3 rd = normalize(vec3(0.0, 0.0, -1.0));
  vec3 nor = calcNormal(p);
  vec3 lig = normalize(vec3(1.0, -1.5*CS(2.), 1.0));
  float dif = clamp(dot(nor, lig), 0.0, 1.0);
  float spe = pow(clamp(dot(reflect(rd, nor), lig), 0.0, 1.0), 64.0);
  float fre = 1.0 - dot(-rd, nor);
  float c = map(p);
  vec3 col =  vec3(1.0) * dif + spe + fre * 0.1;
  gl_FragColor = vec4(col, 1.0);
}