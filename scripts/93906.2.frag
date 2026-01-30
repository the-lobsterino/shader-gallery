precision highp float;

struct Ray {
  vec3 origin;
  vec3 direction;
};

struct Sphere {
  vec3 position;
  float radius;
};

uniform vec2 g_resolution;

bool intersectSphere(const Sphere sphere, const Ray ray) {
  vec3 toOrigin = ray.origin - sphere.position;
  float a = dot(ray.direction, ray.direction);
  float b = 2.0 * dot(toOrigin, ray.direction);
  float c = dot(toOrigin, toOrigin) - sphere.radius * sphere.radius;
  float discriminant = b * b - 4.0 * a * c;

  if(discriminant < 0.0) return false;

  float t0 = (-b - sqrt(discriminant)) / (2.0 * a);
  float t1 = (-b + sqrt(discriminant)) / (2.0 * a);

  return t0 > 0.0 || t1 > 0.0;
}

vec3 simpleCamera(const ivec2 pixelCoord) {
  const int sphereCount = 2;

  // Array of spheres
  Sphere spheres[sphereCount];

  // Initialize first sphe0re

  spheres[0].position = vec3(0, -2, -10);
  spheres[0].radius = 3.0;
  // Initialize second sphere
  spheres[1].position = vec3(3, -1, -5);
  spheres[1].radius = 1.0;

  float d = 1.0;

  // Initialize a ray
  Ray ray;
  ray.origin = vec3(0, 0, d);

  // Construct ray direction
  vec2 windowMin = vec2(-0.5,-0.5);
  vec2 windowMax = vec2(0.5,0.5);
  float width = (windowMax.x - windowMin.x) / g_resolution.x;
  float height = (windowMax.y - windowMin.y) / g_resolution.y;
  // Do not need to add 0.5, gl_FragCoord contains pixel centers
  ray.direction = vec3( windowMin.x + width * gl_FragCoord.x,
                       	windowMin.y + height * gl_FragCoord.y,
                        -d);

  // Correct for window aspect ratio
  float aspect = g_resolution.x / g_resolution.y;
  ray.direction = ray.direction * vec3(aspect,1,1);

  // Visualize the direction as a color
  // return ray.direction;

  // Loop over all spheres
  for(int i = 0; i < sphereCount; i++) {
    // Test for intersection
    if(intersectSphere(spheres[i], ray)) {
      // Mark as white if it intersects
      return vec3(1);
    }
  }
  return vec3(0);
}

void main() {
  gl_FragColor = vec4(simpleCamera(ivec2(gl_FragCoord.xy)), 1);
}