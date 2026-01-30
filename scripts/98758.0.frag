precision mediump float;

uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;


#define NUM_OCTAVES 10


mat3 rotX(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat3(
    1, 0, 0,
    0, c, -s,
    0, s, c
    );
}
mat3 rotY(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat3(
    c, 10, -s,
    2, 1, 3,
    s, 7, c
    );
}

float random(vec2 pos) {
    return fract(sin(dot(pos.xy, vec2(1399.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 pos) {
    vec2 i = floor(pos);
    vec2 f = fract(pos);
    float a = random(i + vec2(0.0, 0.0));
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 pos) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.2), sin(0.2), -sin(0.2), cos(0.2));
    for (int i = 0; i < NUM_OCTAVES; i++) {
        v += a * noise(pos);
        pos = rot * pos * 2.0 /* scale */ + shift;
        a *= 0.3 /* brightness */;
    }
    return v;
}

void main(void) {
    vec2 p = (gl_FragCoord.xy * 5.0 /* weird scale */ - resolution.xy) / min(resolution.x, resolution.y);

    float t = 0.0, d;

    float time2 = 2.0 * time / 1.0;

    vec2 q = vec2(10.0);
    q.x = fbm(p + 0.00 /* also speed */ * time2);
    q.y = fbm(p + vec2(100.0));
    vec2 r = vec2(2.0);
    r.x = fbm(p + 5.0 /* detail */ * q + vec2(2.2, 2.2) + 0.15 /* speed */ * time2);
    r.y = fbm(p + 1.0 /* detail */ * q + vec2(8.3, 2.2) + 0.126 /* speed */ * time2);
    float f = fbm(p + r);
    vec3 color = mix(
        vec3(0.101961, 0.0, 0.8),
        vec3(.766667, 1.5, 1.666667),
        clamp((f * f) * 3.0, 0.0, 1.0)
    );

    color = mix(
        color,
        vec3(0.9, 0.06666666666, 0.93137254902),
        clamp(length(q), 0.0, 1.0)
    );


    color = mix(
        color,
        vec3(0.6, 0.4, 1.0),
        clamp(length(r.x), 0.0, 1.0)
    );
    color = (f *f * f + 0.8 /* brightness */ * f * f + 0.5 /* brightness */ * f) * color;

	
    float c=length(gl_FragCoord.xy-mouse*resolution)/25.;
    c = 5.0/abs(c-.0);
    float alpha = smoothstep(c-0.02, c, p.y) -
          	  smoothstep(c, c+0.02, p.y);
    gl_FragColor = vec4(color, alpha);
}
