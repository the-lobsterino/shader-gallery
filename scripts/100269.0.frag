precision mediump float;

uniform vec2 u_resolution;
uniform sampler2D u_texture;
uniform float u_time;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  vec4 color = texture2D(u_texture, st);

  // Add some moving geometries
  vec2 pos1 = vec2(0.5, 0.5) + 0.5 * vec2(cos(0.1 * u_time), sin(0.1 * u_time));
  vec2 pos2 = vec2(0.5, 0.5) + 0.4 * vec2(cos(0.2 * u_time), sin(0.3 * u_time));
  vec2 pos3 = vec2(0.5, 0.5) + 0.6 * vec2(cos(0.3 * u_time), sin(0.4 * u_time));
  float dist1 = distance(st, pos1);
  float dist2 = distance(st, pos2);
  float dist3 = distance(st, pos3);
  float shape = smoothstep(0.002, 0.005, rand(st * 100.0) * (dist1 + dist2 + dist3));

  // Apply a color gradient based on the y-coordinate of the fragment
  color.rgb = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), st.y);

  // Blend the moving geometries with the color gradient
  color.rgb = mix(color.rgb, vec3(1.0, 1.0, 0.0), 0.4 * shape);

  gl_FragColor = vec4(gl_BaryCoordEXT, 1.0);
}