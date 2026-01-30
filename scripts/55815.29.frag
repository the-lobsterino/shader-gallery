#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float BIG_NUM = 10000000.0;
const float SMALL_NUM = 0.00001;
const float pi = 3.14159265359;
const int MAX_RFLC = 5;
const int light_num = 3;
const int sphere_num = 9;
const int plane_num = 3;


struct Ray {
	vec3 pos;
	vec3 dir;
};
	
struct Light {
	vec3 pos;
	vec3 color_emit;
};
	
struct Intersection {
	vec3 hit_pos;
	vec4 hit_color;
	vec3 hit_normal_dir;
	float hit_dist;
	int rflc_num;
	float rflc_rate;
	vec3 hit_ray_dir;
};
	
struct Sphere {
	vec3 center_pos;
	float radius;
	vec4 color_reflect;
	float rflc_rate;
	int pattern_type; // 0:無地, 1:軸に沿って色が連続変化
	vec3 pattern_axis;
};
	
struct Plane {
	vec3 center_pos;
	vec3 normal_dir;
	vec4 color_reflect;
	float rflc_rate;
	int pattern_type; // 0:無地, 1:格子模様
};

Light light[light_num];
Sphere Spheres[sphere_num];
Plane Planes[plane_num];

// x軸周りの回転
vec3 rotate_x (float theta, vec3 v, vec3 center_pos) {
	vec3 new_v;
	new_v[0] = v[0] + center_pos[0];
	new_v[1] = cos(theta) * v[1] - sin(theta) * v[2] + center_pos[1];
	new_v[2] = sin(theta) * v[1] + cos(theta) * v[2] + center_pos[2];
	return new_v;
}

// y軸周りの回転
vec3 rotate_y (float theta, vec3 v, vec3 center_pos) {
	vec3 new_v;
	new_v[0] = cos(theta) * v[0] + sin(theta) * v[2] + center_pos[0];
	new_v[1] = v[1] + center_pos[1];
	new_v[2] = -sin(theta) * v[0] + cos(theta) * v[2] + center_pos[2];
	return new_v;
}

// z軸周りの回転
vec3 rotate_z (float theta, vec3 v, vec3 center_pos) {
	vec3 new_v;
	new_v[0] = cos(theta) * v[0] - sin(theta) * v[1] + center_pos[0];
	new_v[1] = sin(theta) * v[0] + cos(theta) * v[1] + center_pos[1];
	new_v[2] = v[2] + center_pos[2];
	return new_v;
}

// 軸n周りの回転
vec3 rotate_n (vec3 n, float theta, vec3 v, vec3 center_pos) {
	vec3 new_v;
	new_v[0] = (cos(theta) + n[0] * n[0] * (1.0 - cos(theta))) * v[0] 
				+ (n[0] * n[1] * (1.0-cos(theta)) - n[2] * sin(theta)) * v[1] 
				+ (n[2] * n[0] * (1.0 - cos(theta)) + n[1] * sin(theta)) * v[2]
				+ center_pos[0];
	new_v[1] = (n[0] * n[1] * (1.0 - cos(theta)) + n[2] * sin(theta)) * v[0] 
				+ (cos(theta) + n[1] * n[1] * (1.0 - cos(theta))) * v[1] 
				+ (n[1] * n[2] * (1.0-cos(theta)) - n[0] * sin(theta)) * v[2]
				+ center_pos[1];
	new_v[2] = (n[2] * n[0] * (1.0-cos(theta)) - n[1] * sin(theta)) * v[0] 
				+ (n[1] * n[2] * (1.0 - cos(theta)) + n[0] * sin(theta)) * v[1] 
				+ (cos(theta) + n[2] * n[2] * (1.0 - cos(theta))) * v[2]
				+ center_pos[2];
	return new_v;
}

// rayとsphereの当たり判定
Intersection cross_check_Sphere (Sphere S, Intersection I, Ray camera) {
	vec3 camera2center = S.center_pos - camera.pos; // カメラから球の中心へのベクトル BC
	float B = dot(camera2center, camera.dir); 
	float C = dot(camera2center,camera2center) - S.radius * S.radius;
	float D = B * B - C;
	// rayが当たっている場合
	if (D >= 0.0) {
		float t = B - sqrt(D);
		// カメラに映る場合
		if (t > 0.0) {
			vec3 temp_hit_pos = camera.pos + t * camera.dir; // 衝突点の座標
			vec3 temp_hit_normal_dir = normalize(temp_hit_pos - S.center_pos); // 衝突点での球面の法線ベクトル
			vec3 camera2hit = temp_hit_pos - camera.pos; // カメラから衝突点へのベクトル
			float temp_hit_dist = sqrt(dot(camera2hit, camera2hit)); // カメラと衝突点の距離
			
			// 一番近い場合
			if (temp_hit_dist < I.hit_dist) {
				// Intersectionの位置、法線ベクトル、距離を更新する
				I.hit_pos = temp_hit_pos;
				I.hit_normal_dir = temp_hit_normal_dir;
				I.hit_dist = temp_hit_dist;
				I.hit_ray_dir = camera.dir;
				I.rflc_num++;
				
				// 色の更新
				// 光源から光が当たっているかどうかを内積の正負で判定
				vec3 temp_hit_color = vec3(0.0,0.0,0.0);
				for (int i = 0; i < light_num; i++) {
					vec3 hit2light = light[i].pos - I.hit_pos; // 衝突点から光源へのベクトル DA
					float refl_rate = dot(I.hit_normal_dir, hit2light) / dot(hit2light, hit2light);
					float real_refl_rate = clamp(refl_rate, 0.015, BIG_NUM);
					temp_hit_color += real_refl_rate * light[i].color_emit;
				}
				
				vec4 pattern_color_reflect = S.color_reflect;
				
				//模様1
				if (S.pattern_type == 1) {
					float param = dot(normalize(I.hit_pos - S.center_pos), S.pattern_axis);
					pattern_color_reflect = clamp(sin(param * 20.0)+ 0.6, 0.3, 1.5) * S.color_reflect;
				}
				
				I.hit_color = vec4(temp_hit_color, 1.0)* pattern_color_reflect;
				I.rflc_rate = S.rflc_rate;
			}
		}
	}
	return I;
}

// rayとplaneとの交差判定
Intersection cross_check_Plane2 (Plane P, Intersection I, Ray camera) {
	vec3 bc = P.center_pos - camera.pos;
	float bc_dot_n = dot(bc, P.normal_dir);
	float d_dot_n = dot(camera.dir, P.normal_dir);
	if (- d_dot_n > SMALL_NUM) {
		float t = bc_dot_n / d_dot_n;
		vec3 d_pos = camera.pos + t * camera.dir;
		float dist = distance(d_pos, camera.pos);
		if (dist < I.hit_dist) {
			I.hit_pos = d_pos;
			I.hit_normal_dir = P.normal_dir;
			I.hit_dist = dist;
			I.hit_ray_dir = camera.dir;
			
			vec3 temp_hit_color = vec3(0.0,0.0,0.0);
			for (int i  = 0; i < light_num; i++){
				vec3 da = light[i].pos - d_pos;
				float refl = clamp(dot(P.normal_dir, da) / dot(da, da), 0.01, BIG_NUM);
				
				// 模様1
				if (P.pattern_type == 1) {
					float m = mod(I.hit_pos[0], 4.0);
					float n = mod(I.hit_pos[2], 4.0);
					if((m > 1.0 && n > 1.0) || (m < 1.0 && n < 1.0)){
						refl *= 0.5;
					}
				}
				
				temp_hit_color += refl * light[i].color_emit;
			}
			
			I.hit_color = vec4(temp_hit_color, 1.0) * P.color_reflect;
			I.rflc_num++;
			I.rflc_rate = P.rflc_rate;
		}
	}
	return I;
}

// オブジェクトとの交差判定などを全部やる
Intersection check_intersections (Intersection I, Ray camera) {
	for (int i = 0; i < sphere_num; i++) {
		I = cross_check_Sphere(Spheres[i], I, camera);
	}
	for (int i = 0; i < plane_num; i++) {
		I = cross_check_Plane2(Planes[i], I, camera);
	}
	return I;
}

// 鏡面反射の処理 //工事中 //今の所全部鏡面になってる //床を貫通してる球に対しては透過してしまっている  // 謎の透過バグ
Intersection rflc_mirror (Intersection I, Ray camera) {
	vec4 result_color = I.hit_color;
	vec4 temp_color = vec4(2.0,2.0,2.0,1.0);
	Ray ray = camera; //鏡面反射を追跡するために飛ばすray
	if (I.rflc_num > 0) { // 反射があれば
		temp_color *= I.rflc_rate  * I.hit_color;
		//temp_color *= I.hit_color;
		for (int j = 0; j < MAX_RFLC; j++) {
			ray.pos = I.hit_pos + I.hit_normal_dir * SMALL_NUM; //当たった点でrayを初期化
			ray.dir = reflect(I.hit_ray_dir, I.hit_normal_dir); // 当たった点の法線に対して反射方向にrayを飛ばす
			I = check_intersections(I, ray);
			if(I.rflc_num > j){ // もし、
				result_color += temp_color * I.hit_color;
				temp_color *= I.rflc_rate  * I.hit_color;
				//temp_color *= I.hit_color;
			}
		}
	}
	I.hit_color = result_color;
	return I;
}

// スケーリング : キャンバスを球面に(逆)変換する (これにより、端でも物体の歪みが少なくなる)
// その代わり、床が歪んでしまった...(むしろ自然になったのか？)
Ray scale_coord(vec2 position, Ray camera) {
	Ray scaled_ray;
	scaled_ray.pos = camera.pos;
	//vec3 n = vec3(0.0,0.0,-1.0);
	vec3 n = normalize(camera.pos);
	float t = dot(camera.pos, n) / dot(camera.dir, n);
	scaled_ray.dir = normalize(vec3(( abs(t) / length(camera.pos))*vec2(camera.dir[0],camera.dir[1]), camera.dir[2]));
	return scaled_ray;
}

void main( void ) {

	vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	Ray camera;
	camera.pos = vec3(0.0, 0.0, -8.0);
	camera.dir = normalize(vec3(position.x, position.y, 1.0));
	
	camera = scale_coord(position, camera);
	
	//camera.dir = rotate_x(pi/6.0, camera.dir, vec3(0.0,0.0,-8.0));
	camera.pos = rotate_y(10.0 * mouse.x, camera.pos, vec3(0.0,0.0,3.0));
	camera.dir = rotate_y(10.0 * mouse.x, camera.dir, vec3(0.0,0.0,0.0));
	
	//camera = scale_coord(position, camera);
	
	
	light[0].pos = vec3(2.0,2.0,-2.0);
	light[0].color_emit = vec3(3.0, 3.0, 3.0) / 2.0;
	
	light[1].pos = rotate_y(-3.0 * time, vec3(-7.0,3.0,2.0), vec3(0.0,0.0,3.0));
	light[1].color_emit = vec3(2.0, 2.0, 2.0);
	
	light[2].pos = vec3(3.0, 100.0, -50.0);
	light[2].color_emit = vec3(6.0, 6.0, 6.0);
	
	Spheres[0].center_pos = vec3(0.0, 0.0, 3.0);
	Spheres[0].radius = 3.5;
	Spheres[0].color_reflect = vec4(normalize(vec3(0.5 * cos(time) + 0.2, sin(time) + 0.6, 1.0)), 1.0);
	Spheres[0].rflc_rate = 1.0;
	
	Spheres[1].center_pos = rotate_y(0.5 * time, vec3(5.0,0.0,5.0), vec3(0.0,0.0,3.0));
	Spheres[1].radius = 0.2;
	Spheres[1].color_reflect = vec4(normalize(vec3(1.0, 2.0, 1.0)), 1.0);
	Spheres[1].rflc_rate = 0.5;
	Spheres[1].pattern_type = 1;
	Spheres[1].pattern_axis = normalize(vec3(1.0,1.0,0.0));
	
	vec3 n3 = normalize(vec3(1.0, 1.0, 1.0));
	Spheres[2].center_pos = rotate_n(n3, 1.8 * time, 4.2 * normalize(vec3(1.0, -1.0, 0.0)), vec3(0.0,0.0,3.0));
	Spheres[2].radius = 0.2;
	Spheres[2].color_reflect = vec4(normalize(vec3(2.0, 1.0, 1.0)), 1.0);
	Spheres[2].rflc_rate = 0.2;
	
	vec3 n4 = normalize(vec3(-1.0, 1.0, 1.0));
	Spheres[3].center_pos = rotate_n(n4, -3.0 * time, 3.7 * normalize(vec3(1.0, 1.0, 0.0)), vec3(0.0,0.0,3.0));
	Spheres[3].radius = 0.2;
	Spheres[3].color_reflect = vec4(1.0, 1.0, 0.0, 1.0);
	Spheres[3].rflc_rate = 0.5;
	
	vec3 n5 = normalize(vec3(-1.0, 1.0, 0.0));
	Spheres[4].center_pos = rotate_n(n5, 0.7 * time, 7.0 * normalize(vec3(1.0, 1.0, 0.0)), vec3(0.0,0.0,3.0));
	Spheres[4].radius = 0.2;
	Spheres[4].color_reflect = vec4(1.0, 1.0, 1.0, 1.0);
	Spheres[4].rflc_rate = 0.5;
	
	Spheres[5].center_pos = vec3(-2.0,3.0,4.0);
	Spheres[5].radius = 1.5;
	Spheres[5].color_reflect = vec4(1.0, 0.0, 1.0, 1.0);
	Spheres[5].rflc_rate = 1.0;
	
	Spheres[6].center_pos = vec3(-10.0,10.0,-10.0);
	Spheres[6].radius = 4.5;
	Spheres[6].color_reflect = vec4(1.0, 0.0, 0.0, 1.0);
	Spheres[6].rflc_rate = 1.0;
	Spheres[6].pattern_type = 1;
	Spheres[6].pattern_axis = normalize(vec3(0.2,1.0,0.0));
	
	Spheres[7].center_pos = vec3(-25.0,-11.0,30.0);
	Spheres[7].radius = 12.0;
	Spheres[7].color_reflect = vec4(1.0, 1.0, 0.1, 1.0);
	Spheres[7].rflc_rate = 1.0;
	
	Spheres[8].center_pos = vec3(20.0,10.0,20.0);
	Spheres[8].radius = 10.0;
	Spheres[8].color_reflect = vec4(1.0, 1.0, 1.0, 1.0);
	Spheres[8].rflc_rate =1.0;
	
	
	Planes[0].center_pos = vec3(0.0,-6.0,0.0);
	Planes[0].normal_dir = normalize(vec3(0.0,1.0,0.0));
	Planes[0].color_reflect = vec4(2.0,2.0,2.0,1.0);
	Planes[0].rflc_rate = 1.0;
	Planes[0].pattern_type = 1;
	
	Planes[1].center_pos = vec3(0.0,0.0,-30.0);
	Planes[1].normal_dir = normalize(vec3(0.0,0.0,1.0));
	Planes[1].color_reflect = vec4(2.0,2.0,2.0,1.0);
	Planes[1].rflc_rate = 1.0;
	Planes[1].pattern_type = 0;
	
	Planes[2].center_pos = vec3(50.0,0.0,0.0);
	Planes[2].normal_dir = normalize(vec3(-1.0,0.0,0.0));
	Planes[2].color_reflect = vec4(2.0,2.0,2.0,1.0);
	Planes[2].rflc_rate = 1.0;
	Planes[2].pattern_type = 0;
	
	Intersection I;
	I.hit_dist = BIG_NUM;
	I.hit_color = vec4(0.0, camera.dir[1], camera.dir[1], 1.0);
	
	I = check_intersections(I, camera);
	
	I = rflc_mirror(I, camera);
	
	gl_FragColor = I.hit_color;

}

/*
2019/07/04

[課題の説明]

・実装したもの
	球体の衝突判定
	平面の衝突判定
	キャンバスの球面化
	鏡面反射
	など
*/