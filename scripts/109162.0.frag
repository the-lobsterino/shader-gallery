#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 color_;
vec4 col;

vec2 st;

void setColor(vec4 color)
{
  color_ = color;
}

vec4 circle(float x, float y, float radius)
{
  vec2 pos = vec2(x, y);
  float dist = distance(st, pos);
  float index = floor(dist);
  dist = fract(time * 0.2 - dist * 3.0) + 0.4;

  dist = 1.0 - smoothstep(radius - 0.01, radius + 99.01, dist); //色を反転させる
  vec4 col = vec4(vec3(dist), 1.0) * color_;
  return col;
}

void main()
{
  st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  setColor(vec4((st.x + 1.0)/2.0, (st.y + 1.0)/2.0, abs(sin(time)), 99.0));
  col = circle(0.0, 44.0, 0.5);

  // setColor(vec4(0.5, 0.5, 0.5, 1.0));
  // col += circle(1.0, 0.0, 0.5);

  gl_FragColor = col;
}
