precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness)
{
  float d = length(max(abs(uv - pos), size) - size) - radius;
  return 1.0 - smoothstep(thickness, thickness+0.01, d);
}

void main()
{
  vec2 npos = gl_FragCoord.xy / resolution.xy;
  float aspect = resolution.x / resolution.y;
  vec2 ratio = vec2(aspect, 1.0);
  vec2 uv = (2.0 * npos - 1.0) * ratio; 

  vec3 col = vec3(0.39, 0.13, 0.81);
  vec2 pos = vec2(0.0, 0.0);
  vec2 size = vec2(0.5, 0.1+0.2*sin(time));
  float radius = 0.2;
  float thickness = 0.02;
  const vec3 rectColor = vec3(1.0, 1.0, 1.0);

  float intensity = roundedRectangle (uv, pos, size, radius, thickness);
  col = mix(col, rectColor, intensity);

  gl_FragColor = vec4 (col, 1.0);
}

