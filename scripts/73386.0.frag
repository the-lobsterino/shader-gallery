#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// https://qiita.com/edo_m18/items/034665d42c562da88cb6 参考
// 適宜コメントをつけた

// |pos| < size + 1e-4 なら交差
float dist_func(vec3 pos, float size) {
	return length(pos) - size;
}

// 法線ベクトルの導出
vec3 getNormal(vec3 pos, float size) {
	float ep = 1e-4;
	// epで微分の近似を行う
	return normalize(vec3(
		dist_func(pos, size) - dist_func(vec3(pos.x - ep, pos.y, pos.z), size),
		dist_func(pos, size) - dist_func(vec3(pos.x, pos.y - ep, pos.z), size),
		dist_func(pos, size) - dist_func(vec3(pos.x - ep, pos.y, pos.z - ep), size)
		));
}

#define MAX_ITER 20

void main( void ) {

	// 光線の方向
	vec3 lightDir = normalize(vec3(1.0,1.0, 1.0));
	// ピクセル位置
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	// 色
	vec3 col = vec3(0.0);
	
	// カメラ位置
	vec3 cameraPos = vec3(0.0, 0.0, 1.0);
	// ピクセル位置に向かう方向
	vec3 ray = normalize(vec3(pos, 0.0) - cameraPos);
	// 現在の位置
	vec3 cur = cameraPos;
	vec2 mouseNorm = mouse * 2.0 - 1.0;
	//float size = 0.5 - length(mouseNorm);
	float size = 0.5;	
	
	for (int i = 0; i < MAX_ITER; ++i) {
		float d = dist_func(cur, size);
		// 交差判定
		if (d < 1e-4) {
			// 法線ベクトル
			vec3 normal = getNormal(cur, size);
			float diff = dot(normal, lightDir);
			col = vec3(diff) + vec3(0.1);
			break;
		}
		// 現在位置をさらに進める
		cur += ray * d;
	}

	gl_FragColor = vec4( col, 1.0); 
}