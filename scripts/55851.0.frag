#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float plane(float p, float c, float r) {
	return abs(p - c) - r;
}

float rect(vec2 p, vec2 s) {
	vec2 d = abs(p) - s;
	return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float rect3(vec3 p, float s) {
	return min(rect(p.xz, vec2(s, s)),
		min(rect(p.xy, vec2(s, s)),
		   rect(p.yz, vec2(s, s))));
}

float box(vec3 p, vec3 size) {
	return length(max(abs(p) - size, 0.0));
}

float sphere(vec3 p, vec3 sp, float r) {
	return length(p - sp) - r;
}

vec3 trans(vec3 p){
    return mod(p, 3.0);
}

float dist(vec3 p) {
	//return sphere_d(p, vec3(3.0, 0.0, 3.0), 6.0) + sphere_d(p, vec3(-5.0, 0.0, 3.0), 3.0);
	//return max(box(p, vec3(1.5, 1.5, 1.5)), -rect3(p - vec3(0.0, 0.0, 0.0), 0.5));
	float f = 1.5;
	float d = max(box(p, vec3(f, f, f)), -sphere(p, vec3(f*-0.4, f*1.1, f*-1.0), f*1.3));
	d = max(d, -rect3(p, f/3.0));
	f /= 3.0;
	d = max(d, -rect3(p - f * 2.0 * clamp(floor(p / (f*2.0)), -1.0, 1.0), f/3.0));
	f /= 3.0;
	d = max(d, -rect3(p - f * 2.0 * clamp(floor(p / (f*2.0)), -4.0, 4.0), f/3.0));
	return d;
}

vec3 norm(vec3 pos) {
	float delta = 0.001;
	return normalize(vec3(
		dist(pos - vec3(delta, 0.0, 0.0)) - dist(pos),
		dist(pos - vec3(0.0, delta, 0.0)) - dist(pos),
		dist(pos - vec3(0.0, 0.0, delta)) - dist(pos)
	));
}


struct Ray {
	vec3 pos;
	vec3 dir;
};

void main( void ) {
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y);
	
        // カメラの位置。中心から後方にあるイメージ
	vec3 camera_pos = vec3(-4.0, 4.0, -4.0);
        // カメラの上方向の姿勢を定めるベクトル　この場合水平
	vec3 camera_up = normalize(vec3(0.0, 1.0, 0.0));
        //  カメラの向いている方向　
	vec3 camera_dir = normalize(vec3(1.0, -1.0, 1.0));
        // camera_upとcamera_dirの外積から定まるカメラの横方向のベクトル 
	vec3 camera_side = normalize(cross(camera_up, camera_dir));
	
        // レイの位置、飛ぶ方向を定義する
	Ray ray;
	ray.pos = camera_pos;
	ray.dir = normalize(pos.x * camera_side + pos.y * camera_up + camera_dir);
	
	float t = 0.0, d;
        // レイを飛ばす (計算回数は最大64回まで)
	for (int i = 0; i < 64; i++) {
		d = dist(ray.pos);
                // ヒットした
		if (d < 0.001) {
			break;
		}
                // 次のレイは最小距離d * ray.dirの分だけ進める（効率化）
		t += d;
		ray.pos = camera_pos + t * ray.dir;
	}
	
	vec3 L = normalize(vec3(0.5, -0.6, 1.0)); // 光源ベクトル
	vec3 N = norm(ray.pos); // 法線ベクトル
	vec3 LColor = vec3(0.5, 0.5, 1.0); // 光の色
	vec3 I = dot(N, L) * LColor; // 輝度
	
	if (d < 0.001) {
                // ヒットしていれば白
		gl_FragColor = vec4(I, 1.0);	
	} else {
		gl_FragColor = vec4(0);	
	}
}