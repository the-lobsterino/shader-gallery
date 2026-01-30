precision mediump float;
// uniform はシェーダに外部から送られてくるパラメータを書くときに使う
uniform float time;  // 経過時間 (sec)
uniform vec2 resolution;  // スクリーンサイズ (512.0, 512.0)

#define SPHERE_N 5 // 球体の数

#define CENTER_RADIUS 4.0                   // 太陽の半径
#define CENTER_POSITION (vec3(0.0,0.0,0.0)) // 太陽の位置

#define PI 3.14159

struct Ray {
    vec3 origin;
    vec3 direction;
};

struct Sphere {
    float radius;
    vec3 position;
    vec3 color;
};

struct Plane {
    vec3 position;
    vec3 normal;
    vec3 color;
};

struct Intersection {
    vec3 hitPoint; // 交点
    vec3 normal;   // 交点位置での法線
    vec3 color;    // 交点位置の色
    float distance;
};

const vec3 lightDirection = vec3(1.0,2.0,1.0);

// 第n惑星の軌道半径（適当に決めている）
float orbit_radius(int nth) {
	return 4.0 * CENTER_RADIUS * sqrt(float(nth));
}

// 第n惑星の軌道周期（ケプラーの第３法則を参考にした）
float orbit_period(int nth) {
	float r = orbit_radius(nth);
	return 0.5 * sqrt(r * r * r);
}

// 判定部分の参考: https://knzw.tech/raytracing/?page_id=78#toc-03476ddd7e79e9c8fa7d759966a93ba4-9
void intersectSphere(Ray R, Sphere S, inout Intersection I) {
    vec3  a = R.origin - S.position;
    float b = dot(a, R.direction);
    float c = dot(a, a) - (S.radius * S.radius);
    float d = b * b - c;
    float t = -b - sqrt(d);
    if (d > 0.0 && t > 0.0 && t < I.distance) {
        I.hitPoint = R.origin + R.direction * t;
        I.normal   = normalize(I.hitPoint - S.position);
        d          = clamp(dot(lightDirection, I.normal), 0.1, 1.0);
        I.color    = S.color * d;
        I.distance = t;
    }
}

void intersectPlane(Ray R, Plane P, inout Intersection I) {
	float d = -dot(P.position, P.normal);
	float v = dot(R.direction, P.normal);
	float t = -(dot(R.origin, P.normal) + d) / v;
	
	// hitpoint かもしれない点
	vec3 potential_hitpoint = R.origin + R.direction * t;
	
	// 中心からの距離を測る
	float r = sqrt(potential_hitpoint.x*potential_hitpoint.x+potential_hitpoint.z*potential_hitpoint.z);
	
	// potential_hitpoint は惑星の軌道上にあるか？
	bool on_orbit = false;
	for(int j = 1; j < SPHERE_N; j++) {
		float orbit_r = orbit_radius(j);
		if (orbit_r + 0.25 > r && r > orbit_r) {
			on_orbit = true;
		}
	}
	
	// 惑星の軌道上に無い点は「透明」なものとして扱う
	if (t > 0.0 && t < I.distance && on_orbit) {
		vec3 hitPoint_backup = I.hitPoint;
        	I.hitPoint = R.origin + R.direction * t;
		I.normal = P.normal;
		float d = clamp(dot(I.normal, lightDirection), 0.1, 1.0);
				
		
		float f = 1.0 - min(abs(I.hitPoint.z), 25.0) * 0.04;
		I.color = P.color * d * 1.0;
		I.distance = t;
	}
}

void main(void) {
	// fragment position
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);  // 座標の正規化

	// ray init
	Ray ray;
	ray.origin    = vec3(0.0, 10.0, 30.0);
	ray.direction = normalize(vec3(p.x, p.y,-1.0));

	// intersection init
	Intersection i;
	i.hitPoint = vec3(0.0);
	i.normal   = vec3(0.0);
	i.color    = vec3(0.0);
	i.distance = 1.0e+30;


	// sphere init
	Sphere sphere[SPHERE_N];
	sphere[0].radius   = CENTER_RADIUS;
	sphere[0].position = CENTER_POSITION;
	sphere[0].color    = vec3(1.0, 1.0-sin(time), 0.0);

	for(int j = 1; j < SPHERE_N; j++) {
		float orbit_r = orbit_radius(j); // 惑星の軌道半径（適当に設定）
		float orbit_p = orbit_period(j); // 惑星の周期（ケプラーの第３法則より）
		sphere[j].radius   = CENTER_RADIUS / (2.0 * sqrt(float(j)));
		sphere[j].position = CENTER_POSITION + (orbit_r) * vec3(cos(2.0*PI*time/orbit_p),0.0,sin(2.0*PI*time/orbit_p));
		sphere[j].color    = vec3(float(j)/(float(SPHERE_N-1)),1.0-sin(time),1.0);
	}
	
	// plane init
	Plane plane;
	plane.position = vec3(0.0, 0.0, 0.0);
	plane.normal   = vec3(0.0, 1.0, 0.0);
	plane.color    = vec3(1.0);

	// hit check
	intersectPlane(ray, plane, i);
	for(int j = 0; j < SPHERE_N; j++) {
		intersectSphere(ray, sphere[j], i);
	}

	gl_FragColor = vec4(i.color, 1.0);
}

// gl_FragCoord: シェーダが参照しているピクセル (vec4)
// gl_FragColor: 色を表現、色は基本的に0~1の範囲 (vec4)