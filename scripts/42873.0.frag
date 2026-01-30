precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

// HSV カラー生成関数
vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

void main(void){
    // マウス座標の正規化
    vec2 m = vec2(mouse.x * 1.0 - 0.0, -mouse.y * 1.0 + 0.0);
    
    // フラグメント座標の正規化
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    
    // マンデルブロ集合
    int j = 0;                     // カウンタ
    vec2  x = p + vec2(-0.5, 0.0); // 原点を少しずらす
    float y = 1.5 - mouse.x * 0.5; // マウス座標を使って拡大度を変更
    vec2  z = vec2(0.0, 0.0);      // 漸化式 Z の初期値
    
    // 漸化式の繰り返し処理(今回は 360 回ループ)
    for(int i = 0; i < 360; i++){
        j++;
        if(length(z) > 2.0){break;}
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + x * y;
    }
    
    // 時間の経過で色を HSV 出力する
    float h = mod(time * 20.0, 360.0) / 360.0;
    vec3 rgb = hsv(h, 1.0, 1.0);
    
    // 漸化式で繰り返した回数をもとに輝度を決める
    float t = float(j) / 360.0;
    
    // 最終的な色の出力
    gl_FragColor = vec4(rgb * t, 1.0);
    
}