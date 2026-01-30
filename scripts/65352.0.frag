#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define t time
#define r resolution


//距離関数
float distSphere(vec3 p, float r) {
	float d = length(p) - r;
	return d;
}

//mod演算でpをループさせる
vec3 onRep(vec3 p, float interval) {
	return mod(p, interval) - interval * 0.5;
}

float distanceFunction(vec3 p) {
	float a = abs(sin(t * 0.5)) * 4.0;
	float b = max(a, 2.0);
	float d = distSphere(onRep(p, b), 0.5);
	return d;
}


//法線を算出
//まじでちょっとだけずらして差分を計算 = 勾配の計算
vec3 getNormal(vec3 p) {
	float d = 0.0001;
	return normalize(vec3(
		distanceFunction(p + vec3(d, 0.0, 0.0)) - distanceFunction(p + vec3(-d, 0.0, 0.0)),
		distanceFunction(p + vec3(0.0, d, 0.0)) - distanceFunction(p + vec3(0.0, -d, 0.0)),
		distanceFunction(p + vec3(0.0, 0.0, d)) - distanceFunction(p + vec3(0.0, 0.0, -d))
	));
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);

	vec3 color = vec3(0.3, 0.5, 0.8);
	vec3 lightDir = vec3(-0.977, 0.977, 0.0);

	
	//カメラを定義
	vec3 cameraPos = vec3(0.0, 0.0, -5.0);
	float screenZ = 2.5;
	vec3 rayDirection = normalize(vec3(p, screenZ));
	
	
	//マーチングループ
	float depth = 0.0;
	for (int i = 0; i < 99; i++) {
		vec3 rayPos = cameraPos + rayDirection * depth;
		float dist = distanceFunction(rayPos);
		depth += dist;
		
		if (dist < 0.0001) {
			vec3 normal = getNormal(rayPos); 
			float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
			gl_FragColor = vec4(vec3(diff)+color, 1.0);
			break;
		} else {
			gl_FragColor = vec4(vec3(0.0), 1.0);
		}
	}
	


}