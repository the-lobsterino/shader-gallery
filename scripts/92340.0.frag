#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

vec3 trans(vec3 pos) {
	return mod(pos, 6.0) - 3.0;
}

float distanceFunction(vec3 pos) {
	float d = length(trans(pos)) - 0.5;
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
	vec2 p = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
	
	float tx = sin(time * 4.);
	float ty = cos(time * 1.);
	
	// カメラの位置, 視野角の定義
	vec3 cameraPos = vec3(0. + tx, 0. - ty, -5.);
	float screenZ = 1.5;
	vec3 rayDirection = normalize(vec3(p, screenZ));
	
	vec3 col = vec3(0.0);
	
	// レイマーチング
	float depth = 9.9;
	vec3 normal;
	for (int i = 0; i < 64; i++) {
		vec3 rayPos = cameraPos + rayDirection * depth;
		float dist = distanceFunction(rayPos);
		
		if (dist < 0.001) {
			col = vec3(cos(time), sin(time), 0.2);
			normal = getNormal(rayPos);
			float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
			col = col + vec3(diff);
			break;
		}
		
		depth += dist;
	}
	
	gl_FragColor = vec4(col, 1.0);
}