precision highp float;

uniform float u_time;
uniform vec2 u_resolution;

const float PI = 3.14159265358979323846;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec3 color = vec3(0.0);

  float time = u_time * 0.2;

  float radius1 = 0.3;
  float radius2 = 0.1;
  float x = cos(st.x * 2.0 * PI) * radius1;
  float y = sin(st.x * 2.0 * PI) * radius1;
  float z = sin(st.y * 2.0 * PI) * radius2;

  float angle = time;
  mat3 rotateY = mat3(
    vec3(cos(angle), 0.0, sin(angle)),
    vec3(0.0, 1.0, 0.0),
    vec3(-sin(angle), 0.0, cos(angle))
  );

  vec3 pos = vec3(x, y, z);
  pos = rotateY * pos;

  // map the torus onto a sphere
  float radius = 1.0;
  float r = length(pos.xy);
  float theta = atan(pos.y, pos.x);
  float phi = atan(pos.z, r);
  vec3 spherePos = vec3(
    radius * sin(phi) * cos(theta),
    radius * sin(phi) * sin(theta),
    radius * cos(phi)
  );

  // color the torus
  color += vec3(0.8, 0.2, 0.2) * (1.0 - smoothstep(0.45, 0.5, length(pos.xy - vec2(radius1, 0.0))));

  // add some lighting
  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
  float diffuse = max(0.0, dot(pos, lightDir));
  color += vec3(1.0) * diffuse;

  gl_FragColor = vec4(color, 1.0);
}