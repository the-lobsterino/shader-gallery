#extension GL_OES_standard_derivatives : enable

// VERTEX SHADER
export const vertex_shader_src = `
precision highp float;
in highp vec3 v_position;
in highp vec4 v_color;
in highp vec3 v_uv;

uniform highp mat4 model;
uniform highp mat4 view;
uniform highp mat4 projection;

uniform highp vec4 color;

uniform highp float deform_multiplier;

out highp vec4 f_color;
out highp vec4 f_mcolor;
out highp vec3 f_uv;

void main() {
  vec3 deform_position = vec3(v_uv.x, v_uv.y, 0) * deform_multiplier;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 3.0;
  f_color = v_color;
  f_mcolor = color;
  f_uv = v_uv;
}
`


// rgb <-> hsv conversion functions from https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl
// All components are in the range [0-1], including hue.

// FRAGMENT SHADER
export const fragment_shader_src = `
precision highp float;
in highp vec3 f_position;
in highp vec4 f_color;  // fragment colour
in highp vec4 f_mcolor; // mesh colour
in highp vec3 f_uv;

uniform highp float contour_steps;
uniform highp float contour_shadow;
uniform highp float contour_opacity;
uniform highp float contour_greyscale;
uniform vec3 u_color;

// layout(location = 0) out highp vec4 FragColor;

const float HUE_BLUE = 0.66;  // Make the top value be blue, rather than purple

vec3 rgb2hsv(vec3 c) {
  highp vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  highp vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  highp vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  highp float d = q.x - min(q.w, q.y);
  highp float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
  highp vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  highp vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  highp vec4 colRGBA = vec4(0.8, 0.8, 0.8, 0.5);
  highp float tweak = (1.0 / contour_steps) * (contour_steps + 1.0);   // make N steps go 0..N rather than 0..N-1
  highp float hue = f_uv.z;
  highp float hueContoured = (floor(hue*contour_steps)/contour_steps);
  highp float v = (1.0-(contour_shadow/10.0))+(abs(hueContoured-hue)*contour_shadow*(contour_steps/10.0));
  colRGBA = (contour_greyscale * vec4((1.0-hueContoured)*v, (1.0-hueContoured)*v, (1.0-hueContoured)*v, 0.9)) + ((1.0-contour_greyscale) * vec4(hsv2rgb(vec3(HUE_BLUE * tweak * hueContoured, 0.8, v)), 0.9));

  gl_FragColor = ( ((contour_opacity)*colRGBA) + ((1.0-contour_opacity)*f_color) )* f_mcolor;
  // gl_FragColor = vec4(u_color.r, u_color.g, u_color.b, 1.0).rgba;
  // FragColor = ( ((contour_opacity)*colRGBA) + ((1.0-contour_opacity)*f_color) )  * f_mcolor;
}}