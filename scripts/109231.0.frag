#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;

/*
* @author Hazsi (kinda)
*/
mat2 m(float a) {
    float c=cos(a), s=sin(a);
    return mat2(c,-s,s,c);
}

float map(vec3 p) {
    p.xz *= m(time * 0.4);p.xy*= m(time * 0.01);
    vec3 q = p * 9.8 + time;
    return length(p+vec3(cos(time * 10.05))) * log(length(p) + .0) + sin(q.x + sin(q.z + sin(q.y))) * 0.8 - 0.4;
}

void main() {
    vec2 a = gl_FragCoord.xy / resolution.y - vec2(0.8, 0.5);
    vec3 cl = vec3(0.0);
    float d = 1.5;

    for (int i = 1; i <= 12; i++) {
        vec3 p = vec3(1.0, 0.0, 6.0) + normalize(vec3(a, -1.95)) * d;
        float rz = map(p);
        float f =  clamp((rz - map(p + 0.1)) * 0.4, -0.6, 0.6);
        vec3 l = vec3(1.25, 10.4, 0.6) + vec3(5.0, 3.0, 0.9) * f;
        cl = cl * l + smoothstep(3.0, 0.5, rz) * 0.35 * 0.8;
        d += min(rz, 1.8);
    }

    gl_FragColor = vec4(cl, 2.8);
}