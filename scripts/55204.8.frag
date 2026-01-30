#ifdef GL_ES
precision mediump float;
#endif

//#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

const int   NUM_PLANE = 5;
const int   NUM_TRIANGLE = 1;
const float EPS = 1e-5;

struct Ray {
  vec3 origin;
  vec3 direction;
};

struct Surface {
  int type;
  vec3 color;
};

struct Hit {
  bool valid;
  vec3 position;
  vec3 direction;
  Ray ray;
  Surface surface;
};

struct Sphere {
  vec3 position;
  float radius;
  Surface surface;
};	

struct Plane{
  vec3 position;
  vec3 normal;
  Surface surface;
};
	
struct Triangle{
  vec3 position;
  vec3 edge1;
  vec3 edge2;
  Surface surface;
};

struct Light{
  vec3 position;
  float irrad;
};	

Sphere spheres;
Plane  planes[NUM_PLANE];
Triangle triangles[NUM_TRIANGLE];
Light light;
	
Ray generate_camera_ray() {
  vec3 origin = vec3(0.0);
  vec2 uv = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;
  uv *= vec2(resolution.x / resolution.y, 1.0);
  vec3 dir = vec3(uv, -1.0);
  return Ray(origin, normalize(dir));
}

Hit intersect(Ray ray) {
  Hit min_hit;
  float len = 0.0;
  min_hit.valid = false;
  vec3 origin_to_center = spheres.position - ray.origin;
  vec3 origin_to_dir = ray.direction * dot(ray.direction, origin_to_center);
  float in_sphere_len = spheres.radius * spheres.radius + dot(origin_to_dir, origin_to_dir) -  dot(origin_to_center, origin_to_center);
  if (in_sphere_len > 0.001) {
    float new_length = length(origin_to_dir) - sqrt(in_sphere_len);
    if (new_length > 0.001 && (!min_hit.valid || len > new_length)) {
      len = new_length;
      min_hit.valid = true;
      min_hit.position = ray.origin + new_length * ray.direction;
      min_hit.ray = ray;
      min_hit.direction = normalize(min_hit.position - spheres.position);
      min_hit.surface = spheres.surface;
    }
  }
  for (int i=0; i < NUM_PLANE; i++) {
    float d = -dot(planes[i].position, planes[i].normal);
    float v = +dot(ray.direction, planes[i].normal);
    float t = -(dot(ray.origin, planes[i].normal) + d) / v;
    if (t > EPS) {
      if (!min_hit.valid || len > t) {
        len = t;
        min_hit.valid = true;
        min_hit.position = ray.origin + t * ray.direction;
        min_hit.ray = ray;
        min_hit.direction = planes[i].normal;
        min_hit.surface   = planes[i].surface;
      }
    }
  }
  return min_hit;
}

vec3 shade(Hit hit) {
  for (int i = 0; i < 3; ++i) {
    if (!hit.valid) { return vec3(0.0); }
    if (hit.surface.type == 0) {
      vec3 to_light = light.position - hit.position;
      float r = length(to_light);
      float d = dot(hit.direction, to_light); 
      if (d < 0.0) {
        return vec3(1.0);
      } else {
        return hit.surface.color * light.irrad * d / (4.0 * r * r * 3.1415) / 3.1415;
      }
    }
  }
  return vec3(0.0);
}

void main( void ) {
  light.position = vec3(0.0, 8.1, 10.0);
  light.irrad = 1000.0;
  spheres   = Sphere(vec3(0.0, 5.0 * sin(3.0 * time), -20.0), 3.0, Surface(0, vec3(0.4, 0.4, 1.0)));  // ball
  planes[0] = Plane(vec3( 0.0, -8.0,   0.0), vec3( 0.0, +1.0, 0.0), Surface(0, vec3(1.0, 1.0, 1.0))); // bottom
  planes[1] = Plane(vec3( 0.0, +8.0,   0.0), vec3( 0.0, -1.0, 0.0), Surface(0, vec3(1.0, 1.0, 1.0))); // top
  planes[2] = Plane(vec3( 0.0, +0.0, -20.0), vec3( 0.0,  0.0, 1.0), Surface(0, vec3(1.0, 1.0, 1.0))); // back
  planes[3] = Plane(vec3(-8.0, +0.0,   0.0), vec3( 1.0,  0.0, 0.0), Surface(0, vec3(1.0, 0.4, 0.4))); // left
  planes[4] = Plane(vec3(+8.0, +0.0,   0.0), vec3(-1.0,  0.0, 0.0), Surface(0, vec3(0.4, 0.4, 1.0))); // right
  Ray ray = generate_camera_ray();
  Hit hit = intersect(ray);
  vec3 pixel = shade(hit);
  gl_FragColor = vec4(pixel, 1.0);
}