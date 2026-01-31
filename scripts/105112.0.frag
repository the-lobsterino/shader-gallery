#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere_d(vec3 p) {
	const vec3 sphere_pos = vec3(5.0, 0.0, 10.0);
	const float r = 1.5;
	vec3 pmod = vec3(mod(p.x,6.0),p.y,p.z);
	return length(pmod - sphere_pos) - r;
}

struct Ray {
	vec3 pos;
	vec3 dir;
};

vec3 sphere_normal(vec3 pos) {
  	float delta = 0.00001;
  	return normalize(vec3(
    	sphere_d(pos + vec3(delta, 0.0, 0.0)) - sphere_d(pos),
    	sphere_d(pos + vec3(0.0, delta, 0.0)) - sphere_d(pos),
    	sphere_d(pos + vec3(0.0, 0.0, delta)) - sphere_d(pos)
  	));
}

void main( void ) {
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y);
	
        // カメラの位置。中心から後方にあるイメージ
	vec3 camera_pos = vec3(time,0, -4.0);
        // カメラの上方向の姿勢を定めるベクトル　この場合水平
	vec3 camera_up = normalize(vec3(0.0, 1.0, 0.0));
        //  カメラの向いている方向　
	vec3 camera_dir = normalize(vec3(0.0, 0.0, 1.0));
        // camera_upとcamera_dirの外積から定まるカメラの横方向のベクトル 
	vec3 camera_side = normalize((camera_up, camera_dir));
	
	float camera_depth =1.0;
	
	Ray ray;
	ray.pos = camera_pos;
	ray.dir = normalize(pos.x * camera_side + pos.y * camera_up + camera_dir * camera_depth);

	
	gl_FragColor = vec4(0);
	
	vec3 L = normalize(vec3(1.0, 1.0, 1.0)); // 光源ベクトル
	vec3 LColor = vec3(1.0, 1.0, 1.0); // 光の色
	
	vec3 N; // 法線ベクトル
	vec3 I; // 輝度
	
	float d;
	for (int i = 0; i < 64; i++) {
		d = sphere_d(ray.pos);
		if (d < 0.001) {
			N = sphere_normal(ray.pos);
			I = dot(N,-L) * LColor;
			gl_FragColor = vec4(I, 1.0);
			return;
		}
		ray.pos += d*ray.dir; //球への最短距離(中心との距離)を足す
	}
}