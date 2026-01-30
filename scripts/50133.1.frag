#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 red = vec3(1.0, 0.0, 0.0);
vec3 blue = vec3(0.0, 0.0, 1.0);
vec3 gray = vec3(0.5, 0.5, 0.5);

float dst(vec2 a, vec2 b) {
  return 1. - distance(a, b);
}

void main( void ) {
  vec2 p = gl_FragCoord.xy / resolution.xy;
  
  vec2 a = mouse; //vec2(0.4, 0.4);
  vec2 b = vec2(0.9, 0.5);
  
  float dst_a = dst(p, a);
  float dst_b = dst(p, b);

  if (dst_a < dst_b) {
    float ratio = dst_b / dst_a;
    vec3 color = (
      ratio * red + dst_b * gray
    ) / 2.0;
    gl_FragColor = vec4(color, 1.0);
  } else {
    vec3 color = (
      dst(p, a) * blue
    ) / 1.0;
    gl_FragColor = vec4(color, 1.0);
  }
}