#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// 分割数
#define N 8.0

// 線の色
#define COLOR_LINE RGB(255, 245, 94)

// 背景色
#define COLOR_BG RGB(48, 8, 0)

// 0～255のRGBカラーをvec4に変換
vec4 RGB(int r, int g, int b)
{
    return vec4(r, g, b, 255.0) / 255.0;
}

void main( void ) {

        vec2 uv = ( gl_FragCoord.xy / resolution.x ); // 座標
        
        float w;
        if (fract(uv.x * N) < 0.5 ^^ fract(uv.y * N) < 0.5)
        {
                w = 1.0;
        }
        else
        {
                w = 0.0;
        }
        
        // ピクセルの色の決定
        // w = 1.0の場合は COLOR_LINE
        // w = 0.0の場合は COLOR_BG
        gl_FragColor = (COLOR_LINE - COLOR_BG) * w + COLOR_BG;   
        
}