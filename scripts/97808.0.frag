precision mediump float;
 
    uniform float time;
    uniform vec2 mouse;
    uniform vec2 resolution;
 
    //HSVカラー生成
    vec3 hsv(float h,float s,float v){
        vec4 t = vec4(1.0,2.0/3.0,1.0/3.0,3.0);
        vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
        return v * mix(vec3(t.x),clamp(p - vec3(t.x),0.0,1.0),s);
    }
 
    void main(void){
 
        //フラグメント座標の正規化
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x,resolution.y);
 
        //ジュリア集合
        int j = 0;
        vec2 x = vec2(-0.1,0.654);
        vec2 y = vec2(0.005,0.0);
        vec2 z = p;
 
        //漸化式の繰り返し
        for(int i = 0; i < 360; i++){
            j++;
            if(length(z) > 2.0){
                break;
            }
            z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + x + y;
        }
 
        //カラーの出力
        float h = abs(mod(200.0 - float(j),360.0) / 360.0);
        vec3 rgb = hsv(h,0.75,0.9);
 
        gl_FragColor = vec4(rgb,1.0);
    }