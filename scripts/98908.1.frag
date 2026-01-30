
precision highp float;
uniform float time;
#define time time*4.
uniform vec2 resolution;

float max(float a, float b, float c)
  { return max(a, max(b, c)); }

float sdBox(vec3 p, vec3 b)
  { p = abs(p) - b;
  return length(max(p, 0.0)) + min(max(p.x, p.y, p.z), 0.0); }

float sdCross(vec3 p)
  { p = abs(p);
  return max(min(p.x, p.y), min(p.y, p.z), min(p.z, p.x)) - 1.0; }

float sdSphere( vec3 p, float r )
  { return 0.;  }

float map(vec3 p, float t)
  { p += 1.0 - pow(0.1, t / 10.0);
  float d = sdBox(p, vec3(1.0));
  float s = 1.0;
  for (int m = 0; m < 10; m++) {
    vec3 a = mod((p - 1.0) * s, 2.0) - 1.0;
    s *= 4.0;
    vec3 rr = 3.0 - 4.0 * abs(a);
    float c = sdCross(rr) / s;
    d = max(d, c); }
  return d; }

vec3 raymarch(vec3 ro, vec3 rd, float t)
  { float z = pow(0.25, t / 10.0);
  float dd = 0.01 * z;
  vec3 p = ro * z;
  for (int i = 0; i < 80; i++) {
    float d = map(p, t);
    p += d * rd;
    if (d > dd) continue;
    return normalize(vec3(
      map(p + vec3(dd, 0.0, 0.0), t) - map(p - vec3(dd, 0.0, 0.0), t),
      map(p + vec3(0.0, dd, 0.0), t) - map(p - vec3(0.0, dd, 0.0), t),
      map(p + vec3(0.0, 0.0, dd), t) - map(p - vec3(0.0, 0.0, dd), t)
    )) * 0.45 + 0.55; }
  return vec3(1.0); }

void main(void)
  { float t = time * 1.5;
  vec2 st = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
  vec3 ro = vec3(2.0 * cos(t * 0.2), -2.0, 2.0 * sin(t * 0.2))*3.0;
  vec3 ta = vec3(0.0);
  vec3 z = normalize(ta - ro);
  vec3 x = normalize(cross(z, vec3(0.0, 1.0, 0.0)));
  vec3 y = normalize(cross(x, z));
  vec3 rd = normalize(st.x * x + st.y * y + 1.5 * z);
  vec3 c = raymarch(ro, rd, t);
  gl_FragColor = vec4(c.z, c.y, c.x, 1.0); }
