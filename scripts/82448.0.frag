#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 resolution;
uniform float time;

#define PI 3.141592653589793
#define NUM_CIRCLES 50

vec4 hsv2rgba(in vec3 hsv) {
  float h = hsv.x;
  float s = hsv.y;
  float v = hsv.z;
  vec3 k = vec3(1.0, 2.0/3.0, 1.0/3.0);
  vec3 p = clamp(abs(6.0*fract(h - k) - 3.0) - 1.0, 0.0, 1.0);
  return vec4(v * mix(k.xxx, p, s), 1.0);
}

float hypotsq(vec2 z) {
  return z.x*z.x + z.y*z.y;
}

float sq(float v) {
  return v*v;
}

vec2 getDelta(float t) {
  float w = resolution.x;
  float h = resolution.y;
  return vec2(cos(t)*2.0*w/500.0, sin(t*2.0)*h/500.0)*50.0;
}

void setColor(out vec4 fragColor, in vec4 fragCoord) {
  vec2 xy = fragCoord.xy;
  vec2 cen = resolution.xy/2.0;
  vec2 ab = xy - cen;
  vec2 uv = fragCoord.xy/resolution.xy;
  float radius = max(resolution.x, resolution.y) / 50.0;
  float radius2 = max(resolution.x, resolution.y) / 10.0;
  
  // Moving circles.
  for (int i = 0; i < NUM_CIRCLES; i++) {
    float h = hypotsq(ab + getDelta(time - 2.0*float(i)/float(NUM_CIRCLES)*PI));
    if (h < sq(radius)) {
      float hue = -float(i)/float(NUM_CIRCLES);
      fragColor = hsv2rgba(vec3(hue, 1.0, 1.0));
      return;
    }
  }

  // Black region.
  fragColor = vec4(0.0, 0.0, 0.0, 1.0);
}

void main() {
  setColor(gl_FragColor, gl_FragCoord);
}