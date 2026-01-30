#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



float sphereSize = .1;
#define INTERVAL 2.0


float distance_func(vec3 p)
{
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
	
	vec3 cPos = vec3(0.0, 0.0, 8.0 - time * 12.0); // camera position
	vec3 cDir = vec3(0.0, 0.0, -1.0); // camera direction
	
	#define T (-time * 0.15)
	vec3 cUp = vec3(cos(T), sin(T), 0.0); // camera up
	
	vec3 cSide = cross(cUp, cDir); // cUpとcDirに直交するベクトル
	float depth = 1.0;
	
	vec3 ray = normalize(cSide * p.x + cUp * p.y + depth * cDir);		
	
	// レイマーチング
	float d; // レイとオブジェクト間の距離
	float rLen; // レイに足す長さ
	vec3 rPos; // 例の現在位置
	for(int i = 0; i < 100; i++){
		d = distance_func(rPos); // レイ位置からオブジェクトまでの距離を求める
		rLen += d; // 距離を足す
		rPos = cPos + ray * rLen; // レイ位置の更新
	}	
	
	vec3 lightDir = normalize(vec3(1, 1, 1));
	
	vec3 normal = getNormal(rPos);
	
        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
	
	gl_FragColor = vec4(
		vec3(step(d, 0.1)) * diff, 
		1.0);

}