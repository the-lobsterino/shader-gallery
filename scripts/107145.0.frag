precision highp float;

//開始からの時間(秒)
uniform float time;

//画面の解像度。例えば、　'vec(1920.0,1080.0)'
uniform vec2 resolution;


//add For Vignette
uniform vec3 iResolution;
uniform vec4 iMouse; // mouse pixel coords. xy:current(if MLB down) ,zw:click

//プログラムが終了時、ここに最終的に入っていた色が出力されます
//RGBAで[0,1]の範囲
//out vec4 outColor;

//「距離関数」
//空間上の位置を渡すと、空間内の物体までの最短距離を返す関数
float distFunc( vec3 pos ){
  pos = mod (pos , 4.0 ) - 3.0;
  return length( pos ) -1.0;
}

vec3 trans(vec3 p){
    return mod(p, 6.0) - 3.0;
}

float distFunc2(vec3 pos){
    pos = mod (pos , 5.0 ) - 2.5;
    vec2 t = vec2(0.75* 1., 0.25*0.9);
    vec2 r = vec2(length(pos.xz) - t.x, pos.y);
    return length(r) - t.y;
}

float distFunc4(vec3 pos){
    vec3 q = abs(trans(pos));
    return length(max(q - vec3(0.5, 0.5, 0.5), 0.0)) -0.1 -(sin(time*8.)*0.1);
}

//距離関数を用いて法線を算出する関数
vec3 normalFunc( vec3 pos ){
 vec2 d = vec2( 1.0 , 2.2);
 
 return normalize( vec3(
   distFunc( pos + d.yxx ) - distFunc( pos - d.yxx),
   distFunc( pos + d.xyx ) - distFunc( pos - d.xyx),
   distFunc( pos + d.yxy ) - distFunc( pos - d.xxy)
   ));
}

void main(){
  //画面上のピクセルの位置を(0, 1)の範囲で格納した2次元ベクトル
  vec2 uv= gl_FragCoord.xy / resolution;
  
  //↑で定義しｔuvを、画面中心を原点に、縦横比が1:1の座標系に変換する
  vec2 screenPos = 2.0 * uv -1.0;
  screenPos.x *= resolution.x / resolution.y;

  //レイ(光線)の始点と向きを定義する
  vec3 ro = vec3( 0.0*time, 0.0, 1.0-time*3. );
  vec2 p = uv * 2.0 -1.0; 
  
  //add for Vignette
  p.x *=resolution.x/resolution.y;
  
  
  //fisheye here
  float zfactor = mix(
    1.0,
    2.0 - 0.5 * length (p),
    mix(-0.5,-1.0,sin( time * 0. ))
  );
  vec3 rd =  normalize( vec3( screenPos, -zfactor ) );
  
  //レイマーチングを行う
  float t = 0.0;
  //現在のレイの始点から探索位置までの距離
  float dist;
  //直近の距離関数の結果

  
  for ( int i = 0; i < 100; i++){
    //現在の探索位置を使って距離関数を実行、distに結果を格納する
    dist = distFunc( ro + t * rd);

    //距離関数の結果を使って、探査位置を更新する
    t += dist;
  }
  

  
//もし、直近の距離関数の結果が十分にゼロに近かった場合
//レイが距離関数で表現された物体と交差したと判定する
  if ( dist < 0.01){
    // 交差した場合、法線を可視化して描画する
    vec3 normal = normalFunc( ro + t* rd );
    gl_FragColor = vec4( 0.5 + 0.5 * normal, 1.0);
      
      if ( uv.x > dist ){
        //distance fog here
        gl_FragColor.rgb *= exp(-0.05 * t);
      }
  } else {
  //交差しなかった場合、背景色として黒を描画する
   gl_FragColor = vec4( 0.2, 0.0, 0.5, 1.);
  }
  
  
 dist = iMouse.z < 0.5 ? 0.5 : iMouse.x / resolution.x;
 if ( abs( uv.x - dist ) < 0.002) {
   gl_FragColor = vec4(0.0);
 }else if (uv.x < dist){
   //Vignette here
   gl_FragColor.r *= 1.0 - 0.3 * length( p );
 }
 
  dist = iMouse.z < 0.5 ? 0.5 : iMouse.x / resolution.x;
 if ( abs( uv.x - dist ) < 0.002) {
   gl_FragColor = vec4(0.0);
 }else if (uv.x > dist){
   //Vignette here
   gl_FragColor.r *= 1.0 - 0.3 * length( p );
 }
 
  dist = iMouse.y < 0.5 ? 0.5 : iMouse.y / resolution.y;
 if ( abs( uv.y - dist ) < 0.002) {
   gl_FragColor = vec4(0.0);
 }else if (uv.y < dist){
   //Vignette here
   gl_FragColor.b *= 1.0 - 0.1 * length( p );
 }
 
   dist = iMouse.z < 0.5 ? 0.5 : iMouse.y / resolution.y;
 if ( abs( uv.y - dist ) < 0.002) {
   gl_FragColor = vec4(0.0);
 }else if (uv.y > dist){
   //Vignette here
   gl_FragColor.b *= 1.0 - 0.1 * length( p );
 }
 

}
