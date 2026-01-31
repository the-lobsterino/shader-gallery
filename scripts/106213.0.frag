#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define I resolution

float mp(vec3 p) {

  p.yx *= mat2(cos(.1), sin(.1), -sin(.1), cos(.1));

  vec3 p2 = p;
  p2.x += .5;
  p2.y += .15;

  return min(max(length(p) - .5, -(length(p + vec3(0, .1, 0)) - .48)),
             max(max(length(p2.xz + vec2(-.1, 0.)) - .4,
                     length(p2.xz + vec2(.1, 0.)) - .4),
                 abs(p2.y) - .01)

  );
}

void main() {
  // Normalized pixel coordinates (from 0 to 1)
  vec2 u = (gl_FragCoord.xy * 2.0 - I.xy) / I.y;

  vec3 c, p, o = vec3(0., 0., -1.), r = vec3(u, 1.);
  float t, d;
  for (float i = 0.; i < 64.; i++)
    p = o + r * t, d = mp(p), t += d;

  if (d < 1e-3)
    c = vec3( 1.00, 1.0, 0.0 ) * clamp( dot( p, o ), 0., 1. );

  // Output to screen
  gl_FragColor = vec4(c, 1.0);
}
