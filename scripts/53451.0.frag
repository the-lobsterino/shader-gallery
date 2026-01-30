#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float PI = 3.14159265;
const float ANGLE = 60.0;
const float FOV = ANGLE * 0.5 * PI / 180.0;

const float sphereSize = 1.0; // 球の半径
//光のベクトル
const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

vec3 trans(vec3 p){
	return mod(p,4.) -2.;
}

//球との距離算出
float distanceFunc(vec3 p){
    return length(trans(p)) - sphereSize;
}
//法線算出
vec3 getNormal(vec3 p){
    float d = 0.0001;
    return normalize(vec3(
        distanceFunc(p + vec3(  d, 0.0, 0.0)) - distanceFunc(p + vec3( -d, 0.0, 0.0)),
        distanceFunc(p + vec3(0.0,   d, 0.0)) - distanceFunc(p + vec3(0.0,  -d, 0.0)),
        distanceFunc(p + vec3(0.0, 0.0,   d)) - distanceFunc(p + vec3(0.0, 0.0,  -d))
    ));
}

void main(void){
  
  	//正規化。画面に合わせているので消すな
	 vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  
  
  
    // camera
    vec3 cPos = vec3(0.0,  0.0,  2.0); // カメラの位置
    vec3 cDir = vec3(0.0,  0.0, -1.0); // カメラの向き(視線)
    vec3 cUp  = vec3(0.0,  1.0,  0.0); // カメラの上方向
    vec3 cSide = cross(cDir, cUp);     // 外積を使って横方向を算出
    float targetDepth = 1.0;           // フォーカスする深度
    
    // ray 視点位置
    vec3 ray = normalize(vec3(sin(FOV) * p.x, sin(FOV) * p.y, -cos(FOV)));
    
    
     // レイマーチング用のループ　視覚的にシェーダーを使う
    float distance = 0.0; // レイとオブジェクト間の最短距離
    float rLen = 0.0;     // レイに継ぎ足す長さ　オブジェクトとの最短距離が加算される　カメラの延長線上のある地点。
    vec3  rPos = cPos;    // レイの先端位置　
    for(int i = 0; i < 64; i++){
        distance = distanceFunc(rPos);
        rLen += distance;
        rPos = cPos + ray * rLen;
    }
    
    // hit check
    if(abs(distance) < 0.001){
    	//レイの法線を算出
    	 vec3 normal = getNormal(rPos);
        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
        gl_FragColor = vec4(vec3(diff), 1.0);
    }else{
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
}