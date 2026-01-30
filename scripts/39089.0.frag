#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float segment(vec2 p, vec2 a, vec2 b) {
    vec2 ap = p - a, ab = b - a;
    float k = clamp(dot(ap, ab)/dot(ab,ab), 0.0, 1.0);
    return length(ap - k*ab);
}

float wave(float t, vec2 p)
{
  vec2 p0 = vec2(-1.0, 0.0);
  vec2 p1 = vec2( 1.0, 0.0);
  return 0.004 / segment(p - vec2(0.0, 0.5 * sin(p.x * 10.0 + 10.0 * t)), p0, p1);
}

vec4 render(float t, vec2 p)
{
  return vec4(vec3(wave(t, p)), 1.0);
}

void main( void ) {
    vec2 p = 2.0 * (gl_FragCoord.xy / resolution.xy - 0.5) * resolution.xy / resolution.y;
    gl_FragColor = render(time, p);
}