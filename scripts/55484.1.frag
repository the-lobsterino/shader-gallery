precision highp float;
uniform vec2 resolution;
uniform float time;

mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c,s,-s,c);
}

float box( vec3 p, vec3 b ) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float map(vec3 p, vec3 cPos) {
    vec3 q = p;
    q.xy *= rot(time);
    q.xz *= rot(time);
    float d = box(q, vec3(1,1,1));

    vec3 q2 = p;
    q2.xy *= rot(-time);
    q2.xz *= rot(-time);
    float d2 = box(q2, vec3(0.5,0.5,0.5));

    return max(d, -d2);
}

void main(void) {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 ray = vec3(p, -1.0);
    vec3 cPos = vec3(0.0, 0.0, 4.0);

    // Phantom Mode https://www.shadertoy.com/view/MtScWW by aiekick
    float acc = 0.0;
    float t = 0.0;
    for (int i = 0; i < 99; i++) {
        vec3 pos = cPos + ray * t;
        float dist = map(pos, cPos);
        dist = max(abs(dist), 0.02);
        acc += exp(-dist*3.0);
        t += dist * 0.5;

        if (length(t) > 10.0) break;
    }

    vec3 col = vec3(acc * 0.01);
    gl_FragColor = vec4(col, 1.0);
}
