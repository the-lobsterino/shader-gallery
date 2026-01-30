#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

// 円周率
#define PI 3.1415926535897932384626433832

// 斜線の細かさ
#define N 7.0

// 線の色
#define COLOR_LINE RGB(255, 245, 0)

// 背景色
#define COLOR_BG RGB(0, 0, 0)

// 0～255のRGBカラーをvec4に変換
vec4 RGB(int r, int g, int b)
{
    return vec4(r, g, b, 255.0) / 255.0;
}

// XY座標を回転させる
vec2 rotate(vec2 uv, float radian)
{
    float x = uv.x * cos(radian) - uv.y * sin(radian);
    float y = uv.x * sin(radian) + uv.y * cos(radian);
        
    return vec2(x, y);
}

void main( void ) {

        vec2 uv = ( gl_FragCoord.xy / resolution.x ); // 座標
        
        uv = rotate(uv, - PI / 4.0); // 座標の回転

        uv.y = fract(uv.y * N); // 分割
        
        float w = step(uv.y, 0.5); // 斜線パターン                
        
        // ピクセルの色の決定
        // w = 1.0の場合は COLOR_LINE
        // w = 0.0の場合は COLOR_BG
        gl_FragColor = (COLOR_LINE - COLOR_BG) * w + COLOR_BG;        
}