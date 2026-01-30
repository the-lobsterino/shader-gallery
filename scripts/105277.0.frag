
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2  resolution;

#define PI 3.14

mat2 rotate3d(float angle)
{
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main() {
    vec2 p = (gl_FragCoord.xy * 1.0 - resolution) / min(resolution.x, resolution.y);
    p *= rotate3d((time * 1.0) * PI);
    float t;
    t = 0.075 / abs(1.0/*sin(time)*/ - length(p));
    gl_FragColor = vec4(vec3(t)  * vec3(0.10*(sin(time)+1.0), p.y*0.2, 2.0), 1.0);
}