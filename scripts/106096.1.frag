#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float rainIntensity;
uniform float rainSpeed;

void main() {
    // ピクセルの座標を取得
    vec2 uv = gl_FragCoord.xy / resolution;

    // 雨の動きをシミュレート
    float offset = mod(uv.y * rainSpeed, 1.0);

    // 雨のエフェクトを描画
    vec4 rainColor = vec4(0.0, 0.0, 1.0, 0.5); // 雨の色を設定
    if (offset < rainIntensity) {
        gl_FragColor = rainColor;
    } else {
        gl_FragColor = vec4(0.0);
    }
}
