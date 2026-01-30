precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

//===================================
// ・ランダム / ノイズ / 非整数ブラウン運動
// https://thebookofshaders.com/13/?lan=jp
//===================================

float random (in vec2 p) { 
    return fract(sin(dot(p.xy,vec2(12.9898,78.233)))*43758.5453123);
}

float noise (in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

#define OCTAVES 4
float fbm (in vec2 p) {
    float value = 0.0;
    float amplitud = 0.1;
    float frequency = 0.0;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitud * noise(p);
        p *= 2.0;
        amplitud *= 0.8;
    }
    return value;
}

//===================================
// ・距離関数
// http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
//===================================

float dSpring(vec3 p) {
    vec3 n = normalize(vec3(0.0, 1.0, 0.0));
    float gush = fbm(vec2(p.x, length(p * 2.5) - u_time * 3.0) * 0.15); // 湧き出る動きを実装
    return dot(p, n) + gush;
}

//===================================
// ・法線の取得
// https://wgld.org/d/glsl/g010.html
//===================================

vec3 genNormal(vec3 p) {
    float d = 0.001;
    return normalize(vec3(
        dSpring(p + vec3(  d, 0.0, 0.0)) - dSpring(p + vec3( -d, 0.0, 0.0)),
        dSpring(p + vec3(0.0,   d, 0.0)) - dSpring(p + vec3(0.0,  -d, 0.0)),
        dSpring(p + vec3(0.0, 0.0,   d)) - dSpring(p + vec3(0.0, 0.0,  -d))
    ));
}

//===================================
// ・メイン関数
//===================================

void main() {
    // 色の宣言
    vec3 spring = vec3(0.9, 0.9, 0.6);

    // colorの初期化
    vec3 color = vec3(0.0);

    // 座標の正規化(range: -1.0 ~ 1.0)
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);

    // カメラのセッティング
    vec3 cPos = vec3(0.0,  4.0,   3.0);     // カメラの位置（GLSLおじさんの立ち位置）
    vec3 cDir = vec3(0.0, -1.0,  -1.0);     // カメラの注視点（GLSLおじさんの視点）
    vec3 cUp  = vec3(0.0,  0.5,   1.0);     // カメラの上方向（GLSLおじさんの頭上）
    vec3 cSide = cross(cDir, cUp);          // 外積を使って横方向を算出
    float targetDepth = 1.0;                // 深度

    // レイの生成
    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

    // レイマーチングループ
    float dist = 0.0;   // レイと穴の距離
    float rLen = 0.0;   // レイの長さ
    vec3  rPos = cPos;  // レイの先端
    for (int i = 0; i < 32; i++) {
        dist = dSpring(rPos);
        rLen += dist;
        rPos = cPos + ray * rLen;
    }

    // 衝突判定で色の出しわけ
    if (abs(dist) < 0.001) {
        vec3 normal = genNormal(rPos);  // 物体の法線情報を取得
        vec3 light = normalize(vec3(1.0, 1.0, 0.0));    // ライトの位置
        float diff = max(dot(normal, light), 0.1);  // 拡散光を内積で算出
        color = spring * diff;
    } else {
        color = vec3(0.0);
    }

    // 最終的に該当ピクセルに出力する色
    gl_FragColor = vec4(color, 1.0);
}