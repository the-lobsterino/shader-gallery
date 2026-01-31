
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2  resolution;
uniform float zoom;

#define PI 3.14

mat2 rotate3d(float angle)
{
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main() {
    vec2 p = (gl_FragCoord.xy * 1.0 - resolution) / min(resolution.x, resolution.y);
    p *= rotate3d((time * 1.0) * PI);
}