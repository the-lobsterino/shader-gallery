#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
vec3 onRep(vec3 pos, vec3 interval)
{
    return abs(mod(pos, interval)) - interval * 0.5;
}
mat2 rotate(float a)
{
    float s = sin(a);
    float c = cos(a);
    return mat2(c, s, -s, c);
}
// 1. 球の距離関数
float sphere_d(vec3 pos){
    return length(pos) - 2.0; // 原点にある位置ベクトルから半径を引くと算出できる
}
 
float box_d(vec3 pos,float b) //箱の距離関数
{
    return length(max(abs(pos) - b, 0.0));
}


float sdOctahedron(vec3 p, float s)
{
    p = abs(p);
    float m = p.x+p.y+p.z-s;
    vec3 q;
         if( 3.0*p.x < m ) q = p.xyz;
    else if( 3.0*p.y < m ) q = p.yzx;
    else if( 3.0*p.z < m ) q = p.zxy;
    else return m*0.57735027;
    
    float k = clamp(0.5*(q.z-q.y+s),0.0,s); 
    return length(vec3(q.x,q.y-s+k,q.z-k)); 
}
//距離関数のまとめ
float distanceFunction(vec3 pos){

    float octa = sdOctahedron(onRep(pos, vec3(3.0)), 2.0);

    pos.xy *= rotate(mix(0.1,0.0,(time)));
    float _sphere = sphere_d(onRep(pos, vec3(3.0)));
    float _box = box_d(onRep(pos, vec3(1.0)), 2.0);

    return mix(mix(_box, _sphere,2.0),octa, 2.0);
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

//3. Rayの定義 (構造体)
struct Ray{
    vec3 pos; //Rayの現在の座標
    vec3 dir; //Rayの進行方向
};
void main( void ) {

    vec2 pos = ( gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y); //現在の画素位置を0.0-1.0に正規化
    vec2 mouse_pos = (mouse - 0.5) * 2.0;
    mouse_pos.y *= resolution.y / resolution.x;

    //2. 始点の定義 (カメラの姿勢が定まる
    vec3 camera_pos = vec3(0.0, 0.0, -4.0); //カメラの位置
    vec3 camera_up = vec3(0.0, 1.0, 0.0);  //カメラの上向きベクトル
    vec3 camera_dir = vec3(0.0, 0.0, 1.0); //カメラの前向きベクトル
    vec3 camera_side = cross(camera_up, camera_dir); //カメラの横向きベクトル (上向きベクトルと前向きベクトルの外積
 
    // 4. Rayの設定
    Ray ray; //ここはインスタンスか
    ray.pos = camera_pos; //Rayの初期位置
    ray.dir = normalize(pos.x * camera_side + pos.y * camera_up + camera_dir); // Rayの進行方向はカメラの姿勢から求めることができる
 
    // 5. Rayの判定
    float t = 0.0, d;
    for (int i = 0; i < 120; i++ ){ //何回でもok 十分な数
        d = distanceFunction(ray.pos); //距離関数から現在の距離を求める
        if (d < 0.001) {  //計算できた距離が十分に０に近かったら
            break; //衝突したという判定
        } 
        t += d; //当たらなかったら
        ray.pos = camera_pos + t * ray.dir; //rayの座標更新 どれだけrayを進めるかというと最も近いオブジェクトまでの距離（突き抜け防止
    }

   //8. 光源が当たる方向を定義(z方向に光があたるように
 //  vec3 light_dir = vec3(0.0, 0.0, 1.0);
 
   vec3 light_dir = vec3(- mouse_pos, 1.0); //マウスを光源としてみる
   vec3 normal = sphere_normal(ray.pos);
 
   float l = dot(normal, - light_dir); //法線ベクトルと光源のベクトルの内積（dot)

 
    //6. あたったら色を変える 
   //9, 色を内積の値にする
    if (d < 0.001) {
        gl_FragColor = vec4(l, l, l, 1.0);
    } else {
        gl_FragColor = vec4(0);
    }



}