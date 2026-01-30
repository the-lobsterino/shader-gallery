#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float shared_d(vec3 pos) {
	// 位置ベクトル - 半径
	return length(pos) - 2.;
}

vec3 sphere_normal(vec3 pos) {
	float delta = 0.;
	return normalize(vec3(
		shared_d(pos + vec3(delta, 0., 0.)) - shared_d(pos - vec3(delta, 0., 0.)), // x
		shared_d(pos + vec3(0., delta, 0.)) - shared_d(pos - vec3(0., delta, 0.)), // y
		shared_d(pos + vec3(0., 0., delta)) - shared_d(pos - vec3(0., 0., delta))  // z それぞれに対しての偏微分
	));
}

struct Ray {
	vec3 pos;
	vec3 dir;
};

void main( void ) {
	vec2 pos = (gl_FragCoord.xy * 2. - resolution) / max(resolution.x, resolution.y);
	vec2 mousePos = (mouse - 0.5) * 2.0;
	mousePos.y *= resolution.y / resolution.x;
	
	// カメラの位置
	vec3 cameraPos = vec3(0.0 , 0.0, -8.0);
	// カメラの上向きベクトル
	vec3 cameraUp = vec3(0.0 , 1.0, 0.0);
	// カメラの前向きベクトル
	vec3 cameraDir = vec3(0.0 , 0.0, 1.0);
	// カメラの横向きベクトル
	vec3 cameraSide = cross(cameraUp, cameraDir);
	
	Ray ray;
	ray.pos = cameraPos;
	ray.dir = normalize(pos.x * cameraSide + pos.y * cameraUp + cameraDir);
	
	float t = 0.0,  d;
	for (int i = 0; i < 64; i++) {
		d = shared_d(ray.pos);
		if (d < 0.001) {
			break;
		}
		t += d;
		ray.pos = cameraPos + t * ray.dir;
	}

	vec3 lightDir = vec3(0.0, 0.0, 1.0);
	vec3 normal = sphere_normal(ray.pos);
	float l = dot(normal, -lightDir);
	
	if (d < 0.001) {
		gl_FragColor = vec4(l, l, l, 1.0);
	} else {
		gl_FragColor = vec4(0.0);
	}

}