

#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
// 1. 球の距離関数
float sphere_d(vec3 pos){
    return length(pos) - 1.5; // 原点にある位置ベクトルから半径を引くと算出できる // 2.0->1.5
}
 
 
//10. 立方体の距離関数
float box_d(vec3 pos){
    return length(max(abs(pos) - vec3(1.0, 1.0, 1.0), 0.0));
}
 
// 16. スムース
float smin(float d1, float d2, float k ){
    float res = exp(-k * d1) + exp(-k * d2);
    return -log(res) / k;
}
 
 
//14. 距離関数はくっつけることができる(差集合、積集合など)
float object_d(vec3 pos){
    vec3 p = mod(pos, 8.0) - 4.0; // mod関数を使う
    return smin(sphere_d(p), box_d(p), 5.0); // 引数にpをつける
    //return max(sphere_d(pos), box_d(pos));
 
}
 
 
// 7. 球の法線ベクトル
vec3 sphere_normal(vec3 pos){
    float delta = 0.001;
    return normalize(vec3(
        sphere_d(pos + vec3(delta, 0.0, 0.0)) - sphere_d(pos - vec3(delta, 0.0, 0.0)),
        sphere_d(pos + vec3(0.0, delta, 0.0)) - sphere_d(pos - vec3(0.0, delta, 0.0)),
        sphere_d(pos + vec3(0.0, 0.0, delta)) - sphere_d(pos - vec3(0.0, 0.0, delta))
        ));
}
 
// 11. 立方体の法線ベクトル
vec3 box_normal(vec3 pos){
    float delta = 0.001;
    return normalize(vec3(
        box_d(pos + vec3(delta, 0.0, 0.0)) - box_d(pos - vec3(delta, 0.0, 0.0)),
        box_d(pos + vec3(0.0, delta, 0.0)) - box_d(pos - vec3(0.0, delta, 0.0)),
        box_d(pos + vec3(0.0, 0.0, delta)) - box_d(pos - vec3(0.0, 0.0, delta))
        ));
}
 
// 15.  合成距離関数　３D表現(法線ベクトル）
vec3 object_normal(vec3 pos){
float delta = 0.001;
    return normalize(vec3(
        object_d(pos + vec3(delta, 0.0, 0.0)) - object_d(pos - vec3(delta, 0.0, 0.0)),
        object_d(pos + vec3(0.0, delta, 0.0)) - object_d(pos - vec3(0.0, delta, 0.0)),
        object_d(pos + vec3(0.0, 0.0, delta)) - object_d(pos - vec3(0.0, 0.0, delta))
    ));
}
 
 
 
//3. Rayの定義 (構造体)
struct Ray{
    vec3 pos; //Rayの現在の座標
    vec3 dir; //Rayの進行方向
};
 
//12. 回転行列(X軸)
mat3 x_axis_rot(float angle){
    float c = cos(angle);
    float s = sin(angle);
    return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c); 
 
}
 
//12. 回転行列(Y軸)
mat3 y_axis_rot(float angle){
    float c = cos(angle);
    float s = sin(angle);
    return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0,  c);
}
 
    
void main( void ) {
    
    vec2 pos = ( gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y); //現在の画素位置を0.0-1.0に正規化
    vec2 mouse_pos = (mouse - 0.5) * 2.0;
    mouse_pos.y *= resolution.y / resolution.x;
    
    //2. 始点の定義 (カメラの姿勢が定まる
    vec3 camera_pos = vec3(0.0, 0.0, -8.0 + time * 5.0); //カメラの位置
    vec3 camera_up = vec3(0.0, 1.0, 0.0);  //カメラの上向きベクトル
    vec3 camera_dir = vec3(0.0, 0.0, 1.0); //カメラの前向きベクトル
    vec3 camera_side = cross(camera_up, camera_dir); //カメラの横向きベクトル (上向きベクトルと前向きベクトルの外積
 
    // 4. Rayの設定
    Ray ray; //ここはインスタンスか
    ray.pos = camera_pos; //Rayの初期位置
    ray.dir = normalize(pos.x * camera_side + pos.y * camera_up + camera_dir); // Rayの進行方向はカメラの姿勢から求めることができる
 
  //13. 回転行列追加
   mat3 rot = x_axis_rot(mouse_pos.x) * y_axis_rot(mouse_pos.y);
 
    // 5. Rayの判定
    float t = 0.0, d;
    for (int i = 0; i < 64; i++ ){ //何回でもok 十分な数
        d = object_d(rot * ray.pos); //距離関数から現在の距離を求める
        if (d < 0.001) {  //計算できた距離が十分に０に近かったら
            break; //衝突したという判定
        } 
        t += d; //当たらなかったら
        ray.pos = camera_pos + t * ray.dir; //rayの座標更新 どれだけrayを進めるかというと最も近いオブジェクトまでの距離（突き抜け防止
    }
    
   //8. 光源が当たる方向を定義(z方向に光があたるように
//   vec3 light_dir = vec3(0.0, 0.0, 1.0);
 
   vec3 light_dir = vec3(- mouse_pos, 1.0); //マウスを光源としてみる
   vec3 normal = object_normal(rot * ray.pos);
 
   float l = dot(normal, - light_dir); //法線ベクトルと光源のベクトルの内積（dot)
    
 
    //6. あたったら色を変える 
   //9, 色を内積の値にする
    if (d < 0.001) {
        gl_FragColor = vec4(l, l, l, 1.0);
    } else {
        gl_FragColor = vec4(0);
    }
    
}