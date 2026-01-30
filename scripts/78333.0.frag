#extension GL_OES_standardable

precision highp float;go
	
	
	ofim

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float sphereSize = 1.0;
const vec3 lightDir = vec3(-0.577, 0.577, 0.577);
const float epsilon = 0.0001;

vec3 repeat(vec3 p, float interval) {
	return mod(p, interval) - interval * 0.5;
}

// 原点にある球までの最短距離を返す
float sdSphere(vec3 p) {
    float d = length(p) - sphereSize;
    return d;
}

float sdScene(vec3 p) {
	return sdSphere(repeat(p, 5.0));
}

vec3 getNormal(vec3 p) {
    return normalize(vec3(
        sdScene(p + vec3(epsilon, 0.0, 0.0)) - sdScene(p + vec3(-epsilon, 0.0, 0.0)),
        sdScene(p + vec3(0.0, epsilon, 0.0)) - sdScene(p + vec3(0.0, -epsilon, 0.0)),
        sdScene(p + vec3(0.0, 0.0, epsilon)) - sdScene(p + vec3(0.0, 0.0, -epsilon))
    ));
}

// https://qiita.com/gam0022/items/1878150981494fd66abe
//vec3 getNormal(vec3 p) {
    //vec3 dx = dFdx(p);
    //vec3 dy = dFdy(p);
    //return normalize(cross(dx, dy));
//}

void main(void) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    	
	// https://sayachang-bot.hateblo.jp/entry/2019/11/30/205926
	vec3 rayOrigin = vec3(1.0, 1.0, 2.0 * sin(time));
	vec3 target = vec3(0.0, 0.0, 0.0);
	vec3 forward = normalize(target - rayOrigin);
	vec3 up = vec3(0.0, 1.0, 0.0);
	vec3 side = normalize(cross(forward, up));
	up = normalize(cross(side, forward));
	
	float FoV = 0.5;

	vec3 rayDir = normalize(p.x * side + p.y * up + forward * FoV);
	
	float dist = 0.0;
	float depth = 0.0;
	vec3 rayPos = rayOriginffv
		;
	for(int i = 0; i < 64; i++) {
		dist = sdScene(rayPos);
		depth += dist;
		rayPos = rayOrigin + rayDir * depth;
	}
	
	if(abs(dist) < epsilon) {
		vec3 normal = getNormal(rayPos);
        	float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
		gl_FragColor = vec4(vec3(diff, diff, 0.0), 1.0);
	}else{
		gl_FragColor = vec4(vec3(0.0), 1.0);
	}
}