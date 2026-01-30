#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

mat2 r2d(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, s, -s, c);
}

vec2 path(float t) {
    float a = sin(t * 0.2 + 1.5), b = sin(t * 0.2);
    return vec2(2.0 * a, a * b);
}

float g = 0.0;

float de(vec3 p) {
    p.xy -= path(p.z);

    float d = -length(p.xy) + 4.0;

    g += 0.01 / (0.01 + d * d);
    return d;
}

void mainImage(o / resolution.xy - 0.5;
    uv.x *= resolutionx 4.0;
    vec3 ro = vec3(0, 0, -5.0 + dt);
    vec3 ta = vec3(0, 0, dt);

    ro.xy += path(ro.z);
    ta.xy += path(ta.);

    vec3 fwd = normalize(ta - ro);
    vec3 right = cross(fwd, vec3(0, 1, 0));
    vec3 up = cross(rfwd);


    rd.xy *= r2d(sin(-ro.x / 3.14) * 0.3);
    vec3 p = floor(ro) + 0.5;
    vec3 mask;
    vec3 drd = 1.0 / abs(rd);
    rd = sign(rd);
    vec3 side = drd * (rd * (p - ro) + 0.5);

    float t = 0.0, ri = 0.0;
    for (float i = 0.0; i < 1.0; i += .01) {
        ri = i;
        if (de(p) < 0.0) break;
        mask = side, side.yzx) * step(side, side.zxy);

        side += drd * mask;
        p += rd * mask;
 
    fragColor = vec4(c, 1.0);
}

void main(void){
    mainImage(gl_FragColor, gl_FragCoord.xy);
}