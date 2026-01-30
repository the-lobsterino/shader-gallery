#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif


uniform vec2 u_resolution;
uniform vec2 u_mouse;
//uniform bool mousePosition;
//uniform vec4 pcolor;
uniform float u_time;

//attribute vec4 color;

//varying vec4 vertColor;

#define ST 255.0
#define PI 3.14159265358979323846

const float intensity = 0.5;
const float offsetX = 3.0;
const float offsetY = 3.0;
const int   number   = 10;
const float size     = 0.04;
const float minSize  = 0.3;
bool mousePosition = true;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float rand(vec2 co, float l) {
    return rand(vec2(rand(co), l));
  }

  float rand(vec2 co, float l, float t) {
    return rand(vec2(rand(co, l), t));
  }

  float wrap(float x, float min) {
    return abs(mod(x, 2.0) - 1.0) + min;
  }

  float particle(vec2 p, float fx, float fy, float ax, float ay) {
    vec2 r;

    if(mousePosition)
      r = vec2(p.x + cos(u_time * fx) * ax * (u_mouse.x * offsetX), p.y + sin(u_time * fy) * ay * (u_mouse.y * offsetY));
    else
      r = vec2(p.x + cos(u_time * fx) * ax * offsetX, p.y + sin(u_time * fy) * ay * offsetY);

    return ( size * wrap( u_time * ax, minSize ) ) / length(r);
  }

void main() {
    //vec2 uv = -1. + 2. * gl_FragCoord.xy / resolution.xy;

    vec2 q = gl_FragCoord.xy / u_resolution.xy; // Ratio
    vec2 p = (4.0 * q) - 2.0;                 // Center
    p.x *= u_resolution.x / u_resolution.y;       // Good aspect value
    vec3 color = vec3(137.0/ST,188.0/ST,222.0/ST);

    float col = 0.0;
    float counter = 0.0;

    for(int i = 0; i < number; i++) {
      col += particle(p, rand(vec2(counter)), rand(vec2(counter), 1.0, 10.0), counter, counter);
      counter += 0.1;
    }

    gl_FragColor.rgb = vec3(col) * color;


}
