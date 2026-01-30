#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

const float PI = 3.14159265359;

// Function to calculate the distance between a point and a sphere
float distanceToSphere(vec3 p, vec3 center, float radius) {
  return length(p - center) - radius;
}

// Function to calculate the distance between a point and a plane
float distanceToPlane(vec3 p, vec3 normal, float distance) {
  return dot(p, normal) + distance;
}

// Function to perform ray marching
float rayMarching(vec3 ro, vec3 rd) {
  float t = 0.0;
  for (int i = 0; i < 50; i++) {
    vec3 p = ro + t * rd;
    float d = distanceToSphere(p, vec3(0.0), 1.0);
    if (d < 0.001) {
      return t;
    }
    t += d;
    if (t > 100.0) {
      return -1.0;
    }
  }
  return -1.0;
}

// Function to calculate the color of a pixel
vec3 getColor(vec2 uv) {
  vec2 aspectRatio = u_resolution.xy / min(u_resolution.x, u_resolution.y);
  vec2 pixelPosition = (-aspectRatio + 2.0 * uv) / aspectRatio.y;
  vec3 ro = vec3(0.0, 0.0, 3.0);
  vec3 rd = normalize(vec3(pixelPosition, -1.0));
  float t = rayMarching(ro, rd);
  if (t < 0.0) {
    return vec3(0.0);
  }
  vec3 p = ro + t * rd;
  vec3 normal = normalize(p - vec3(0.0));
  vec3 light = normalize(vec3(1.0, 1.0, 0.0));
  float diffuse = dot(normal, light);
  return vec3(diffuse);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec3 color = getColor(uv);
  gl_FragColor = vec4(color, 1.0);
}
