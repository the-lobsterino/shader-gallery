#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / resolution.y; // Normalized coordinates
  vec3 color = vec3(0.0);

  // Animation
  float animationSpeed = 1.0;
  float amplitude = 0.1;
  float distortion = sin(time * animationSpeed + uv.x) * amplitude;
  
  // Apply distortion to uv coordinates
  uv += distortion;

  // Generate color based on uv coordinates
  color = vec3(uv.x, uv.y, 0.5);
  
  gl_FragColor = vec4(color, 1.0);
}
