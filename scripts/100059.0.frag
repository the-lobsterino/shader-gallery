//This code was written entirely by chatGPT!!!

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


uniform vec2 u_center;
uniform float u_scale;
void main() {
  vec2 c = vec2(
    (gl_FragCoord.x - 0.5 * resolution.x) / 200.-.5,
    (gl_FragCoord.y - 0.5 * resolution.y) / 200. 
  );
  vec2 z = vec2(0.0, 0.0);
  float iterations = 0.0;
  float maxIterations = 100.0;
  for (int i = 0; i < 1000; i++) {
    if (dot(z, z) > 4.0 || iterations > maxIterations) {
      break;
    }
    vec2 newZ = vec2(
      z.x * z.x - z.y * z.y + c.x,
      2.0 * z.x * z.y + c.y
    );
    z = newZ;
    iterations += 1.0;
  }
  float t = log(iterations) / log(maxIterations);
  vec3 color = vec3(
    t * 0.2 + 0.6,
    sin(t * 10.0 + 0.3) * 0.5 + 0.5,
    sin(t * 20.0 + 0.6) * 0.5 + 0.5
  );
  gl_FragColor = vec4(color, 1.0);
}