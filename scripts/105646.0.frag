
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2  resolution;

#define PI 3.14

mat2 rotate3d(float angle)
{
    return mat2((angle), -sin(angle),sin(angle), sin(angle));
}

void main() {
    vec2 p = (gl_FragCoord.xy * 2.00 - resolution) / min(resolution.x, resolution.y);
    p *= rotate3d(sin(time * .20) * PI);
    float t;
    t = 0.19 / abs(.900/*sin(time)*/ - length(p));
    gl_FragColor = vec4(vec3(t)  * vec3(0.10*(sin(time)+2.00), p.y*1.0 , 100), 1.0);
}