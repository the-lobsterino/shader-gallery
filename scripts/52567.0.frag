#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere_d(vec3 p) {
	const vec3 sphere_pos = vec3(0.0, 0.0, 3.0);
	const float r = 1.0;
	return length(p - sphere_pos) - r;
}

struct Ray {
	vec3 pos;
	vec3 dir;
};

void main( void ) {
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y);
	
        // カメラの位置。中心から後方にあるイメージ
	vec3 camera_pos = vec3(0.0, 0.0, -4.0);
        // カメラの上方向の姿勢を定めるベクトル　この場合水平
	vec3 camera_up = normalize(vec3(0.0, 1.0, 0.0));
        //  カメラの向いている方向　
	vec3 camera_dir = normalize(vec3(0.0, 0.0, 1.0));
        // camera_upとcamera_dirの外積から定まるカメラの横方向のベクトル 
	vec3 camera_side = normalize(cross(camera_up, camera_dir));
	
        // レイの位置、飛ぶ方向を定義する
	Ray ray;
	ray.pos = camera_pos;
	ray.dir = normalize(pos.x * camera_side + pos.y * camera_up + camera_dir);
	
	float t = 0.0, d;
        // レイを飛ばす (計算回数は最大64回まで)
	for (int i = 0; i < 64; i++) {
		//d = sphere_d(ray.pos);
                // ヒットした
		if (d < 0.001) {
			break;
		}
                // 次のレイは最小距離d * ray.dirの分だけ進める（効率化）
		t += d;
		ray.pos = camera_pos + t * ray.dir;
	}

	if (d < 0.001) {
                // ヒットしていれば白
		gl_FragColor = vec4(1);	
	} else {
		gl_FragColor = vec4(0);	
	}
}