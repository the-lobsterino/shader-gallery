/*
 * Original shader from: cc7
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// Emulate some GLSL ES 3.x
int int_mod(int a, int b)
{
    return (a - (b * (a/b)));
}

// --------[ Original ShaderToy begins here ]---------- //
// A x-mas tree quickly written on xmas-eve.
// Warning: Might contain bugs and non-optimal code :)


#define NUM_POINTS 140.

vec2 rotate(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  mat2 m = mat2(c, -s, s, c);
  return m * v;
}

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float ring(vec2 uv, float d) {
  float l = smoothstep(0.1, 0., pow(abs(d - 0.1), 0.4));
  return l;
}

float ambient_light(float d) { return smoothstep(0.4, 0., d) * 0.1; }

float center(float d) { return pow(0.019 / d, 2.); }

float beams(vec2 uv, vec3 p, float d) {
  float invD = 1. / d;
  float l = 0.;
  for (float i = 0.; i < 6.28; i += .57) {
    vec2 offset = p.xy;
    vec2 rotated = offset + rotate(uv - offset, iTime + i * .5 + p.x * 100.);
    l += smoothstep(0.005, 0., abs(rotated.x - p.x)) * invD * 0.03;
  }
  return l;
}

vec3 get_color(int index) {
    int mod_idx = int_mod(index, 3);
    if (mod_idx == 0)
        return vec3(1.9, 1.3, 0.2);
    else if (mod_idx == 1)
        return vec3(0.9, 0.3, 0.1);
    else
        return vec3(0.8, 1.2, 0.4);
}

vec3 star(float index, vec2 uv, vec3 p, bool beam, bool halo) {
  float r = p.z;
  uv *= .5 + r * 10.;
  float d = max(0.0001, distance(uv, p.xy));
  float invD = 1. / d;
  vec3 color = vec3(0.);

  int iIndex = int(index);
  vec3 ring_color = get_color(iIndex);
  vec3 center_color = get_color(iIndex + 1);
  vec3 ambient_color = get_color(2);

  // ring
  if (halo) {
    for (float i = 1.; i < 5.; i++) {
      if (i >= mod(index, 5.)) break;
      color += ring(uv, d + i * 0.01) * ring_color * (1. / i);
    }
  }
  // ambient light
  color += ambient_light(d) * (center_color * ambient_color);

  // center
  color += center(d) * center_color;

  // beams
  if (beam) {
    color += beams(uv, p, d) * ring_color;
  }
  return clamp(color * min(1., 0.012 / pow(p.z, 0.5)), 0., 1.);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  // Normalized pixel coordinates
  vec2 uv = fragCoord / iResolution.xy;
  uv -= .5;

  float aspectRatio = iResolution.x / iResolution.y;
  uv.x *= aspectRatio;

  vec3 col = vec3(0., 0.05, 0.1);

  float t = iTime * 0.2;

  // Play with different values here for different designs
  const float k = 102.;

  vec3 origin = vec3(0, 0, 0.5 + cos(iTime * 0.1) * 0.1);

  for (float i = 0.; i < NUM_POINTS; i++) {
    float p = i / NUM_POINTS;
    float pkt = p * k + t;
    vec3 xyz =
        vec3(cos(pkt) * (1. - p), -1.4 + p * 3., sin(pkt) * (1. - p) * 0.1);

    // Only draw front
    if (xyz.z < .0) {
      col += star(i, uv, origin + xyz, xyz.z > 0.15, false) * 3.;
    }
  }

  // Top star
  col += star(3., uv, origin + vec3(0, 1.7, 0.0), true, false) * 30.;

  col *= vec3(1, 0.8, 0.9);

  // Gamma-corr
  col = pow(col, vec3(0.4545));

  // Noise
  col *= 0.75 + hash21(uv.xy + fract(iTime)) * 0.25;

  // vingette
  float vignette = 1. - length(uv);
  vignette = pow(abs(vignette), 0.3);

  fragColor = vec4(col * vignette, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}