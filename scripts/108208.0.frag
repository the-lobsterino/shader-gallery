#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

// 球体の距離関数
float sphere(vec3 p, float r) {
    return length(p) - r;
}

// シーンの距離関数
float scene(vec3 p) {
    return sphere(p, 1.0);
}

// レイマーチングのアルゴリズム
float rayMarch(vec3 ro, vec3 rd, float start, float end) {
    float depth = start;
    for (int i = 0; i < 100; i++) {
        float dist = scene(ro + rd * depth);
        if (dist < 0.001) {
            return depth;
        }
        depth += dist;
        if (depth >= end) {
            return end;
        }
    }
    return end;
}

// メイン関数
void main(void) {
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    vec3 ro = vec3(0.0, 0.0, 3.0); // カメラ位置
    vec3 rd = normalize(vec3(uv, -1.0)); // レイの方向

    float dist = rayMarch(ro, rd, 0.0, 100.0);
    vec3 color = vec3(0.0);
    if (dist < 100.0) {
        color = vec3(0.5, 0.7, 1.0); // 水鞠の色
    }

    gl_FragColor = vec4(color, 1.0);
}
