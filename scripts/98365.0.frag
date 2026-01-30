#ifdef GL_ES
precision mediump float;
#endif

// Uniforms
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Main function
void main() {
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // Time-based animation
  float t = u_time * 0.5;

  // Compute color
  vec3 color = vec3(uv, t);

  // Output to screen
  gl_FragColor = vec4(color, 1.0);
}
