#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 lightDir = vec3(-0.600, 0.600, 0.600);

vec3 trans(vec3 pos) {
	return mod(pos, 5.0) - 3.0;
}

float distanceFunction(vec3 pos) {
	float d = length(trans(pos)) - 1.0;
	return d;
}

float sdBox (vec3 p, float s) {
	p = abs(p) - s;
	return max(max(p.x, p.y), p.z);
}

vec3 getNormal(vec3 p) {
	float d = .9;
	return normalize(vec3(
		distanceFunction(p + vec3(d, 0.0, 0.0)) - distanceFunction(p + vec3(-d, 0.0, 0.0)),
		distanceFunction(p + vec3(0.0, d, 0.0)) - distanceFunction(p + vec3(0.0, -d, 0.0)),
		distanceFunction(p + vec3(0.0, 0.0, d)) - distanceFunction(p + vec3(0.0, 0.0, -d))
		));
}

void main( void ) {
	// 描画空間の定義
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	float tx = sin(time * 2.0);
	float ty = cos(time * 2.0);
	
	// カメラの位置, 視野角の定義
	vec3 cameraPos = vec3(10.0 + tx, 50.0 - ty, -10.0);
	float screenZ = 3.0;
	vec3 rayDirection = normalize(vec3(p, screenZ));
	
	vec3 col = vec3(0.0);
	
	// レイマーチング
	float depth = 20.0;
	vec3 normal;
	for (int i = 0; i < 128; i++) {
		vec3 rayPos = cameraPos + rayDirection * depth;
		float dist = distanceFunction(rayPos);
		
		if (dist < 0.001) {
			col = vec3(cos(time), sin(time), 0.1);
			normal = getNormal(rayPos);
			float diff = clamp(dot(lightDir, normal), 0.1, 1.5);
			col = col + vec3(diff);
			break;
		}
		
		depth += dist;
	}
	
	gl_FragColor = vec4(col, 5.0);
}