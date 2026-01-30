#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

// 2D回転関数
vec2 rotate(vec2 uv, float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    mat2 rotationMatrix = mat2(c, -s, s, c);
    return rotationMatrix * uv;
}

void main(void)
{
    // ピクセル座標を正規化（0.0から1.0の範囲にする）
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // 座標を画面の中心に移動
    vec2 centeredUv = uv - vec2(0.5);

    // 時間に基づいて回転させる
    float angle = time * 1.5;
    centeredUv = rotate(centeredUv, angle);

    // 竜巻のような動きを作成
    float radius = length(centeredUv);
    float swirl = atan(centeredUv.y, centeredUv.x);
    float intensity = sin(swirl * 10.0 - radius * 20.0 - time * 4.0);

    // 色を適用して出力
    gl_FragColor = vec4(vec3(intensity * 0.5 + 0.5), 1.0);
}
