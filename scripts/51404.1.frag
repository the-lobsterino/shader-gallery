#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 square(float y, float x, float u_y, float b_y, float l_x, float r_x) {
  return vec3(
    y > u_y && y < b_y && x > l_x && x < r_x
      ? vec3(1.0, 1.0, 1.0)
      : vec3(0.0, 0.0, 0.0)
  );
}

bool proximity(float y, float x, float center_y, float center_x, float r) {
  return pow(x - center_x, 2.0) + pow(y - center_y, 2.0) < pow(r, 2.0);
}

void main() {
  float y = gl_FragCoord.y;
  float x = gl_FragCoord.x;
  vec3 rgb;
  
  //rgb = square(y, x, 100.0, 300.0, 280.0, 480.0);
  rgb = proximity(y, x, 200.0, 400.0, 60.0)
    ? vec3(1.0, 1.0, 1.0)
    : vec3(0.0, 0.0, 0.0);
	
  gl_FragColor = vec4(rgb, 1);
}