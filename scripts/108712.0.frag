#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float u_tileFactor; // タイリング係数
uniform sampler2D u_texture; // テクスチャ
varying vec2 v_texCoord; // UV座標

void main() {
    // タイリング処理
    vec2 tiledCoord = fract(v_texCoord * u_tileFactor);

    // グリッド座標を計算
    vec2 gridCoord = floor(v_texCoord * u_tileFactor);

    // グリッドIDを計算（例: 簡単なX + Y）
    float gridID = gridCoord.x + gridCoord.y;

    // IDに基づいて色を決定
    vec4 color = texture2D(u_texture, tiledCoord);
    color *= gridID; // 例えば、IDに応じて明るさを変える

    gl_FragColor = color;
}