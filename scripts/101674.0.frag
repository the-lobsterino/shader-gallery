/*
 * Original shader from: https://www.shadertoy.com/view/DlBGz3
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define S(a, b, t) smoothstep(a, b, t)
#define PI 3.1415926

float Hash21(vec2 p) {
    p = fract(p * vec2(123.45, 234.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);

}
mat2 Rot(float a) {
    a = a / 180. * PI;
    float c = cos(a);
    float s = sin(a);
    return mat2(c, s, -s, c);
}

vec2 withInBox(vec2 uv, vec4 rect) {
    return (uv - rect.xy) / (rect.zw - rect.xy);
}

float line(vec2 p, vec2 a, vec2 b) {
    vec2 ap = p - a;
    vec2 ab = b - a;
    float proj = clamp(dot(ab, ap) / dot(ab, ab), 0.0, 1.0);
    return length(ap - proj * ab);
}

vec4 Head(vec2 uv, float time) {
    vec4 col = vec4(vec3(1.0, 0.976, 0.96), 0.);

    float y = uv.y + (uv.x * uv.x) * 0.5;
    vec2 nuv = vec2(uv.x, y);
    float d = length(nuv);
    float blur = 0.005;
    float m = S(0.2, 0.2 - blur, d);
    float size = 0.;

    float side = sign(uv.x);
    uv.x = abs(uv.x);
    float t = fract(time * 0.3);
    float rt = smoothstep(0.1, 0.22, t) * smoothstep(0.25, 0.22, t);
    float rt2 = smoothstep(0.22, 0.34, t) * smoothstep(0.46, 0.34, t);
    rt += rt2;
    float rotation = mix(-13., -15., rt);
    vec2 ruv = uv * Rot(rotation);
    vec4 rect = vec4(0.0, 0.0, 0.5, 0.5);
    nuv = withInBox(ruv - vec2(0.08, 0.2), rect);
    nuv = vec2(nuv.x, nuv.y - (nuv.x * nuv.x) * 20.);
    nuv *= vec2(4.0, 1.0);
    d = length(nuv);

    size = 0.4;
    blur = 0.01;
    m += S(size, size - blur, d);

    // 耳朵
    m = clamp(m, 0., 1.);
    col.a = max(col.a, m);
    vec3 pink = vec3(255, 182, 195) / 255.;
    blur = 0.05;
    nuv = withInBox(ruv * vec2(2.) - vec2(0.15, 0.55), rect);
    nuv = vec2(nuv.x, nuv.y - (nuv.x * nuv.x) * 10.);
    nuv *= vec2(4.0, 1.0);

    d = length(nuv);
    m = S(size, size - blur, d);
    col.rgb = mix(col.rgb, pink, m);

    // 眼睛
    blur = 0.05;
    size = 0.37;
    rect = vec4(0.0, 0.0, 0.1, 0.1);
    vec2 offs = vec2(0.12, -0.03);
    rect.xy += offs;
    rect.zw += offs;
    nuv = withInBox(uv, rect);
    d = length(nuv);
    m = S(size, size - blur, d);
    col.rgb = mix(col.rgb, vec3(0.2), m);

    // 眼睛高光
    blur = 0.05;
    size = 0.15;
    rect = vec4(0.0, 0.0, 0.1, 0.1);
    offs = vec2(0.12, -0.03);
    rect.xy += offs;
    rect.zw += offs;
    nuv = withInBox(uv, rect);

    t = smoothstep(0.5, 0.6, fract(time * 0.5)) * 3.14159 * 2.;
    float xx = 0.1 * cos(t + 1.);
    float yy = 0.1 * sin(t + 1.);
    d = length(nuv - vec2(xx * side, yy));
    m = S(size, size - blur, d);
    col.rgb = mix(col.rgb, vec3(1.0), m);

    // 腮红
    blur = 0.5;
    size = 0.68;
    rect = vec4(0.0, 0.0, 0.1, 0.1);
    offs = vec2(0.12, -0.03);
    rect.xy += offs;
    rect.zw += offs;
    nuv = withInBox(uv, rect);
    d = length(nuv - vec2(0.2, -0.9));
    m = S(size, size - blur, d);
    col.rgb = mix(col.rgb, pink * 1.2, m);

    blur = 0.01;
    size = 0.015;
    rect = vec4(0.0, 0.0, 0.5, 0.5);
    offs = vec2(0.0, -0.0);
    rect.xy += offs;
    rect.zw += offs;
    nuv = withInBox(uv, rect);
    nuv.y += -6. * ((nuv.x - 0.05) * (nuv.x - 0.05));
    nuv.y -= -0.18;
    d = line(nuv, vec2(0.), vec2(0.08, 0.0));
    m = S(size, size - blur, d);
    col.rgb = mix(col.rgb, vec3(0.), m);

    return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord.xy - .5 * iResolution.xy) / iResolution.y;
    float gradient = smoothstep(-0.5, 0.2, uv.y);
    vec3 col = mix(vec3(1.0, 0.8, 0.9), vec3(0.7, 0.9, 1.0), gradient);
    vec4 head = Head(uv, iTime);

    uv *= 5.;
    vec2 id = floor(uv);
    float n = Hash21(id);
    vec2 st = fract(uv) - 0.5;
    float vn = smoothstep(0.2, 0.8, n) * 0.5 + 0.1;
    st *= Rot(fract(iTime * vn) * 360. + n * 123.4);

    vec4 fractHead = Head(st, 0.);
    col = mix(col, fractHead.rgb, fractHead.a);
    col = mix(col, head.rgb, head.a);

    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}