#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse; // マウスクリック位置

void main(void) {
    // 正規化されたスクリーン座標を計算します
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    // マウスクリック位置からの距離を計算します
    float distance = length(uv - mouse);
    
    // 波の振幅と周波数を設定します
    float amplitude = 0.3;
    float frequency = 4.0;
    
    // 波の高さを計算します。distanceが小さいほど波の高さが大きくなります
    float waveHeight = amplitude * sin(distance * frequency - time);
    
    // 波の高さを色にマッピングして、波紋を生成します
    vec3 color = vec3(0.0, 0.0, 1.0) * waveHeight; // 青い色の波
    
    // 波紋を描画
    gl_FragColor = vec4(color, 1.0);
}
