#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;

#define BG_COLOR vec3(1., 1., 0.9)
#define LINE_COLOR vec3(0.1)
#define DOT_COLOR vec3(1.0, 0.1, 0)

#define LINE_SIZE 0.007
#define DOT_SIZE 0.015


// 3次のラグランジュ補間
float lagrange_3(vec2 p, vec2 p1, vec2 p2, vec2 p3)
{
    float l =
    + p1.y * (p.x - p2.x)  / (p1.x - p2.x)  * (p.x - p3.x) / (p1.x - p3.x)
    + p2.y * (p.x - p3.x)  / (p2.x - p3.x)  * (p.x - p1.x) / (p2.x - p1.x)
    + p3.y * (p.x - p1.x)  / (p3.x - p1.x)  * (p.x - p2.x) / (p3.x - p2.x);

    return step(abs(p.y - l), LINE_SIZE);
}

// 4次のラグランジュ補間
float lagrange_4(vec2 p, vec2 p1, vec2 p2, vec2 p3, vec2 p4)
{
    
    float l =
    + p1.y * (p.x - p2.x)  / (p1.x - p2.x) * (p.x - p3.x) / (p1.x - p3.x) * (p.x - p4.x) / (p1.x - p4.x)
    + p2.y * (p.x - p3.x)  / (p2.x - p3.x) * (p.x - p4.x) / (p2.x - p4.x) * (p.x - p1.x) / (p2.x - p1.x)
    + p3.y * (p.x - p4.x)  / (p3.x - p4.x) * (p.x - p1.x) / (p3.x - p1.x) * (p.x - p2.x) / (p3.x - p2.x)
    + p4.y * (p.x - p1.x)  / (p4.x - p1.x) * (p.x - p2.x) / (p4.x - p2.x) * (p.x - p3.x) / (p4.x - p3.x)
    ;

    return step(abs(p.y - l), LINE_SIZE);
}

float drawPoint(vec2 p, vec2 center)
{
    return step(length(p - center), DOT_SIZE);
}

void main()
{
    vec2 p = (gl_FragCoord.xy - 0.5 * vec2(resolution.x, 0)) / resolution.y;

    float t = time * 1.5;
    float t1 = t * 0.5;
    float t2 = t * 1.0;
    float t3 = t * 1.5;
    float t4 = t * 2.0;

    // ラグランジュ補間の点
    vec2 p1 = vec2(-0.2, 0.5) + vec2(0.3 * cos(t1), 0.2 * sin(t1));
    vec2 p2 = vec2(-0.1, 0.5) + vec2(0.6 * cos(t2), 0.2 * sin(t2));
    vec2 p3 = vec2(0.1, 0.5) + vec2(0.6 * cos(t3), 0.2 * sin(t3));
    vec2 p4 = vec2(0.2, 0.5) + vec2(0.3 * cos(t4), 0.2 * sin(t4));

    // ラグランジュ補間の曲線を描画
    vec3 c = mix(BG_COLOR, LINE_COLOR, lagrange_4(p, p1, p2, p3, p4));

    // 点の描画
    c = mix(c, DOT_COLOR, drawPoint(p, p1));
    c = mix(c, DOT_COLOR, drawPoint(p, p2));
    c = mix(c, DOT_COLOR, drawPoint(p, p3));
    c = mix(c, DOT_COLOR, drawPoint(p, p4));

    gl_FragColor = vec4(c, 1);
}