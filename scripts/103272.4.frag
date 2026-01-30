#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

// 太陽の位置と色をシミュレートする関数
vec3 sunPosition(float time) {
    return vec3(sin(time), cos(time), 0.0);
}

vec3 sunColor(vec3 sunPosition) {
    float intensity = max(0.0, 1.0 - length(sunPosition.xy));
    return mix(vec3(1.0, 0.5, 0.0), vec3(0.5, 0.0, 0.5), intensity);
}

// 波の動きをシミュレートする関数
float wave(vec2 st) {
    return 0.5 * sin(st.x * 10.0 + u_time) * cos(st.y * 10.0 + u_time);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;

    // 太陽の位置と色を計算
    vec3 sunPos = sunPosition(u_time);
    vec3 sunCol = sunColor(sunPos);

    // 波の動きを計算
    float waveHeight = wave(st);
    st.y += waveHeight;

    // 太陽の位置と波の高さに基づいて色をブレンド
    vec3 color = mix(vec3(0.0, 0.0, 0.8), sunCol, max(0.0, dot(st, sunPos.xy)));
    color = mix(color, vec3(0.0, 0.3, 0.6), waveHeight);

    gl_FragColor = vec4(color, 1.0);
}
