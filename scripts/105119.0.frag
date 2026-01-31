#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;

/*
* @author Hazsi (kinda)
* Redacted by ConeTin
*/
mat2 m(float a) {
    float c=cos(a), s=sin(a);
    return mat2(c,-s,s,c);
}

float map1(vec3 p) {
    vec3 q = p * 2.0 + time;
    float amplitude = 3.0;
    return amplitude * (length(p+vec3(0.0)) * log(length(p) + 1.0) + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0);
}

void main1() {
    vec2 a = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    vec3 cl = vec3(0.0);
    float d = 2.5;

    for (int i = 0; i <= 4; i++) {
        vec3 p = vec3(0, 0, 4.0) + normalize(vec3(a, -1.0)) * d;
        float rz = map1(p);
        float f =  clamp((rz - map1(p + 0.1)) * 0.5, -0.1, 1.0);
        vec3 l = vec3(0.0, 1.0, 0.0) + vec3(0.0, 1.0, 0.0) * f; // Green color
        cl = cl * l + smoothstep(2.5, 0.0, rz) * 0.6 * l;
        d += min(rz, 1.0);
    }

    gl_FragColor = vec4(cl, d); 
}

// Shader 2: Blue with low amplitude
float map2(vec3 p) {
    vec3 q = p * 2.0 + time;
    float amplitude = 1.0;
    return amplitude * (length(p+vec3(0.0)) * log(length(p) + 1.0) + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0);
}

void main2() {
    vec2 a = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    vec3 cl = vec3(0.0);
    float d = 2.5;

    for (int i = 0; i <= 4; i++) {
        vec3 p = vec3(0, 0, 4.0) + normalize(vec3(a, -1.0)) * d;
        float rz = map2(p);
        float f =  clamp((rz - map2(p + 0.1)) * 0.5, -0.1, 1.0);
        vec3 l = vec3(0.0, 0.0, 1.0) + vec3(0.0, 0.0, 1.0) * f; // Blue color
        cl = cl * l + smoothstep(2.5, 0.0, rz) * 0.6 * l;
        d += min(rz, 1.0);
    }

    gl_FragColor = vec4(cl, d); 
}
