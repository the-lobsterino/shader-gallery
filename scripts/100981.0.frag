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

// 乱数生成関数
vec2 rand(vec2 co)
{
    return fract(sin(vec2(dot(co, vec2(127.1, 311.7)), dot(co, vec2(269.5, 183.3)))) * 43758.5453);
}

// ノイズ関数
float noise(vec2 st)
{
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(dot(rand(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                   dot(rand(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
               mix(dot(rand(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                   dot(rand(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

void main(void)
{
    // ピクセル座標を正規化（0.0から1.0の範囲にする）
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // 座標を画面の中心に移動
    vec2 centeredUv = uv - vec2(0.5);

    // 時間に基づいて回転させる
    float angle = time * 0.5;
    centeredUv = rotate(centeredUv, angle);

    // ノイズを使用して予測不可能な動きを追加
    float n = noise(centeredUv * 5.0 + time);

    // 竜巻のような動きを作成
    float radius = length(centeredUv);
    float swirl = atan(centeredUv.y, centeredUv.x);
    float intensity = sin(swirl * 8.0 - radius * 16.0 - time * 4.0 + n * 10.0);

    // 色相環の90度以内で色を適用して出力
    float hue = (intensity * 0.5 + 0.5) * 0.25;
    vec3 color = vec3(1.0 - hue, 1.0, hue);
    gl_FragColor = vec4(color, 1.0);
}
