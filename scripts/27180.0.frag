#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float epsilon = 0.0001;

float smoothmin(float a, float b, float k)
{
  float v = clamp(0.5+0.5*(b-a)/k, 0., 1.);
  return mix(b, a, v) - k * v * (1.0 - v);;
}

// define distance field
float sphere(vec3 p, float radius)
{
  return length(p) - radius;
}

float cylinder(vec3 p, vec2 h)
{
  vec2 d = abs(vec2(length(p.xz), p.y)) - h;
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float pawnShape(vec3 p)
{
  float head = sphere(p+vec3(0,-0.5,0), 0.25);
  float neck = cylinder(p+vec3(0,-0.25,0), vec2(0.3, 0.02));
  float d = min(head, neck);
  
  float increment = 0.09 + 0.015 * exp(-10.0*p.y-0.5);
  float body = cylinder(p, vec2(increment, 0.3));
  d = smoothmin(d, body, 0.05);
  
  float leg = cylinder(p+vec3(0,0.35,0), vec2(0.325, 0.03));
  d = smoothmin(d, leg, 0.05);
  
  float scale = 0.35;
  vec3 p_foot = p+vec3(0,0.5,0);
  p_foot.y /= scale;
  float foot = sphere(p_foot, 0.45) * scale;
  d = smoothmin(foot, d, 0.05);
  
  float plate = cylinder(p+vec3(0,0.625,0), vec2(0.5, 0.03));
  d = smoothmin(plate, d, 0.025);
  
  return d;
}


vec2 intersect(vec3 p)
{
  vec2 dist2pawn = vec2(pawnShape(p), 1);
  return dist2pawn;
}
vec2 trace(vec3 ray_o, vec3 ray_d)
{
  float t = 0.0;
  for(int i = 0; i < 64; ++i) {
    vec3 p = ray_o + t * ray_d;
    vec2 h = intersect(p);  // h.x: distance marced
    if (h.x < epsilon) return vec2(t, h.y);
    t += h.x;
  }
  return vec2(0.0);
}

vec3 computeNormal(vec3 p)
{
  vec3 eps = vec3(epsilon, 0, 0);
  vec3 n;
  n.x = intersect(p+eps.xyy).x - intersect(p-eps.xyy).x;
  n.y = intersect(p+eps.yxy).x - intersect(p-eps.yxy).x;
  n.z = intersect(p+eps.yyx).x - intersect(p-eps.yyx).x;
  return normalize(n);
}

float phong(vec3 n, vec3 wi, vec3 wo, float alpha)
{
  vec3 wr = 2.0 * dot(wi, n) * n - wi;
  return pow(dot(wo, wr), alpha);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv.x *= resolution.x / resolution.y;
  
  vec3 color = vec3(0.0);
  
  vec3 ray_o = vec3(0, 0, 2);
  vec3 ray_d = normalize(vec3(-1.0+2.0*uv, -1.5));
  vec2 t = trace(ray_o, ray_d);
  if(t.y > 0.5) {
    vec3 p = ray_o + t.x * ray_d;
    vec3 n = computeNormal(p);
    
    vec3 light_dir = normalize(vec3(1.0, 0.8, 0.6));
    float cos_theta = max(dot(light_dir, n), 0.0);
    vec3 diffuse = cos_theta * vec3(0.8);
    
    vec3 specular = vec3(1.0) * phong(n, light_dir, -ray_d, 15.0);
    
    vec3 ambient = (0.5 + 0.5*n.y) * vec3(0.1);
    
    color = specular + diffuse + ambient;
  }
  gl_FragColor = vec4(color, 1.0);
}