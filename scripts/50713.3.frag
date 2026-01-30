#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphereSize = 1.0;
#define INTERVAL 4.0

float distance_func(vec3 p)
{
	p.z -= mod(time * 10.0, 1000.0);
	
	// 空間を立方体に分割
	vec3 pi = floor(p / INTERVAL); 		
	p.x += sin(pi.z * 4.0 + time);
	p.y += sin(pi.z * 2.0 + time * 0.4);
	p = mod(p, INTERVAL) - INTERVAL / 2.0;	
		
	// 点pから球までの距離
	return length(p) - sphereSize;
}

vec3 getNormal(vec3 p){
    float d = 0.0001;
    return normalize(vec3(
        distance_func(p + vec3(  d, 0.0, 0.0)) - distance_func(p + vec3( -d, 0.0, 0.0)),
        distance_func(p + vec3(0.0,   d, 0.0)) - distance_func(p + vec3(0.0,  -d, 0.0)),
        distance_func(p + vec3(0.0, 0.0,   d)) - distance_func(p + vec3(0.0, 0.0,  -d))
    ));
}

void main( void ) {
	vec2 p = ( gl_FragCoord.xy - resolution.xy / 2.0 ) / min(resolution.x, resolution.y);
	
	// カメラ定義
	vec3 cPos = vec3(0.0, 0.0, 0.01); // camera position
	vec3 cDir = vec3(0.0, 0.0, -1.0); // camera direction	
	vec3 cUp = vec3(0.0, 1.0, 0.0); // camera up
	vec3 cSide = cross(cUp, cDir); // cUpとcDirに直交するベクトル
	float depth = 1.0;
	
	// レイマーチング
	vec3 ray = normalize(cSide * p.x + cUp * p.y + depth * cDir);	// レイ
	float dist; // レイとオブジェクト間の距離
	float rLen; // レイに足す長さ
	vec3 rPos; // レイの現在位置
	for(int i = 0; i < 80; i++){
		dist = distance_func(rPos); // レイ位置からオブジェクトまでの距離を求める
		rLen += dist; // 距離を足す
		rPos = cPos + ray * rLen; // レイ位置の更新
	}
	float marchResult = step(dist, 0.01); // レイマーチングの結果 : distがある程度小さい場合は1.0
	vec3 bgColor = vec3(0.0, 0.1, 0.2); // 背景色
	vec3 marchColor = mix(vec3(marchResult), bgColor, 0.2); // レイマーチング結果に背景色を混ぜる
	
 	// リムライティング : 光と法線の内積をとる
	vec3 normal = getNormal(rPos);
	float rim = 1.0 - dot(normalize(cDir), normal);		
	rim = dot(vec3(0, 0, 1), normal);
	rim = smoothstep(.5, 0.0, rim);
	rim = .6 + rim * 0.4;
	
	// 逆2乗の法則 : 光は距離の2乗に反比例する
	float distMix= 100.0 / (1.0 + rLen * rLen); // rLenが0.0の時に増幅させないために1.0足す
	distMix = clamp(distMix, 0., 0.3); // 
	// distMix = pow(distMix, 0.5); // イイ感じに補正	
	
	vec3 c1 = vec3(0.0, 0.0, 0.5);
	vec3 c2 = vec3(1.0, 1.0, 1.0);
	vec3 fogColor = bgColor; // 空気の色
	
	vec3 finalRGB = marchColor * mix(c1, c2, distMix) * rim + fogColor; // 画面に出力するRGBカラー
	finalRGB *= 0.65; // イイ感じになるように少し暗くする
	gl_FragColor = vec4(finalRGB, 1.0);	
}