/*
 * Original shader from: https://www.shadertoy.com/view/ddt3R7
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// CC0: City of Kali
//  Wanted to created some kind of abstract city of light
//  Had the idea that Kali fractal might be a good start.
//  10/10 - would use Kali fractal again :).

// Kali fractal source: http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/


#define TIME        iTime
#define RESOLUTION  iResolution
#define PI          3.141592654
#define TAU         (2.0*PI)
#define ROT(a)      mat2(cos(a), sin(a), -sin(a), cos(a))

// License: WTFPL, author: sam hocevar, found: https://stackoverflow.com/a/17897228/418488
const vec4 hsv2rgb_K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 hsv2rgb(vec3 c) {
  vec3 p = abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www);
  return c.z * mix(hsv2rgb_K.xxx, clamp(p - hsv2rgb_K.xxx, 0.0, 1.0), c.y);
}
// License: WTFPL, author: sam hocevar, found: https://stackoverflow.com/a/17897228/418488
//  Macro version of above to enable compile-time constants
#define HSV2RGB(c)  (c.z * mix(hsv2rgb_K.xxx, clamp(abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www) - hsv2rgb_K.xxx, 0.0, 1.0), c.y))

// License: Unknown, author: nmz (twitter: @stormoid), found: https://www.shadertoy.com/view/NdfyRM
vec3 sRGB(vec3 t) {
  return mix(1.055*pow(t, vec3(1./2.4)) - 0.055, 12.92*t, step(t, vec3(0.0031308)));
}

// License: Unknown, author: Matt Taylor (https://github.com/64), found: https://64.github.io/tonemapping/
vec3 aces_approx(vec3 v) {
  v = max(v, 0.0);
  v *= 0.6;
  float a = 2.51;
  float b = 0.03;
  float c = 2.43;
  float d = 0.59;
  float e = 0.14;
  return clamp((v*(a*v+b))/(v*(c*v+d)+e), 0.0, 1.0);
}

vec3 effect(vec2 p, vec2 pp) {
  vec2 c = -vec2(0.5, 0.5)*1.05;

  float s = 3.0;
  vec2 kp = p/s;
  kp += sin(0.05*(TIME+100.0)*vec2(1.0, sqrt(0.5)));
 
  const float a = PI/4.0;
  const vec2 n = vec2(cos(a), sin(a));

  float ot2 = 1E6;
  float ot3 = 1E6;
  float n2 = 0.0;
  float n3 = 0.0;

  const float mx = 15.0;
  for (float i = 0.0; i < mx; ++i) {
    float m = (dot(kp, kp));
    s *= m;
    kp = abs(kp)/m + c;
    float d2 = (abs(dot(kp,n)))*s;
    if (d2 < ot2) {
      n2 = i;
      ot2 = d2;
    }
    float d3 = (dot(kp, kp));
    if (d3 < ot3) {
      n3 = i;
      ot3 = d3;
    }
  }
  vec3 col = vec3(0.0);
  n2 /= mx;
  n3 /= mx;
  col += hsv2rgb(vec3(0.55+0.2*n2, 0.90, 0.00125))/(ot2+0.001);
  col += hsv2rgb(vec3(0.05-0.1*n3, 0.85, 0.0025))/(ot3+0.000025+0.005*n3*n3);
  col -= 0.1*vec3(0.0, 1.0, 2.0).zxy;
  col *= smoothstep(1.5, 0.5, length(pp));  
  col = aces_approx(col);
  col = sRGB(col);
  return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 q = fragCoord/RESOLUTION.xy;
  vec2 p = -1. + 2. * q;
  vec2 pp = p;
  p.x *= RESOLUTION.x/RESOLUTION.y;
  vec3 col = vec3(0.0);
  col = effect(p, pp);
  fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}