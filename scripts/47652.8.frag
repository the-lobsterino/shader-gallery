#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

/*------------------------------------------------------------------
    Qiita : WebGL と GLSL で気軽にレイトレーシングに挑戦してみよう！
    https://qiita.com/doxas/items/477fda867da467116f8d
    を参考にしてコードを書いた
------------------------------------------------------------------*/

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//構造体の定義
//レイ
struct Ray {
	vec3 origin; //始点
	vec3 direction; //方向
};
//球
struct Sphere {
	float radius; // 半径
	vec3 position; // 位置
	vec3 color; // 色
};
//平面
struct Plane {
	vec3 position;
	vec3 normal;
	vec3 color;
};
//交差判定用の構造体
struct Intersection {
	float dist; // 交差地点との距離
	vec3 hitPoint; // 交点の座標
	vec3 normal; // 交点位置の法線
	vec3 color; // 交点位置の色
};

//光の方向
const vec3 lightDirection = vec3(0.577);

//球との交差判定
void intersectSphere(Ray R, Sphere S, inout Intersection I) {
	vec3 a = R.origin - S.position;
	float b = dot(a, R.direction);
	float c = dot(a, a) - (S.radius * S.radius);
	float d = b * b - c;
	float t = -b - sqrt(d);
	if (d > 0.0 && t > 0.0 && t < I.dist) {
		// 交点の計算
		I.hitPoint = R.origin + R.direction * t;
		// 法線ベクトルを交点と原点から計算
		I.normal = normalize(I.hitPoint - S.position);
		// ディフューズを計算
		float d = clamp(dot(lightDirection, I.normal), 0.1, 1.0);
		I.color = S.color * d;
		I.dist = t;
	}
}

//平面との交差判定
void intersectPlane(Ray R, Plane P, inout Intersection I) {
	float d = -dot(P.position, P.normal);
	float v = dot(R.direction, P.normal);
	float t = -(dot(R.origin, P.normal) + d) / v;
	if (t > 0.0 && t < I.dist) {
		I.hitPoint = R.origin + R.direction * t;
		I.normal = P.normal;
		float d = clamp(dot(I.normal, lightDirection), 0.1, 1.0);
		float m = mod(I.hitPoint.x, 2.0);
		float n = mod(I.hitPoint.z, 2.0);
		if ((m > 1.0 && n > 1.0) || (m < 1.0 && n < 1.0)) {
			d *= 0.5;
		}
		float f = 1.0 - min(abs(I.hitPoint.z), 25.0) * 0.04;
		I.color = P.color * d * f;
		I.dist = t;
	}
}
	
void main( void ) {
	// fragment position
	vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	// レイの初期化
	Ray ray;
	ray.origin = vec3(0.0, 0.0, 5.0);
	ray.direction = normalize(vec3(position.x, position.y, -1.0));
	
	// 交差構造体の初期化
	Intersection intersect;
	intersect.dist = 1.0e+30;
	intersect.hitPoint = vec3(0.0);
	intersect.normal = vec3(0.0);
	intersect.color = vec3(0.0);
	
	// 球の初期化
	Sphere sphere;
	sphere.radius = 1.0;
	sphere.position = vec3(0.0);
	sphere.color = vec3(1.0);
	
	// 平面の初期化
	Plane plane;
	plane.position = vec3(0.0, -1.0, 0.0);
	plane.normal = vec3(0.0, 1.0, 0.0);
	plane.color = vec3(1.0);
	
	// 交差の判定
	vec3 destColor = vec3(0.0);
	intersectSphere(ray, sphere, intersect);
	intersectPlane(ray, plane, intersect);
	
	destColor = intersect.color;
	
	gl_FragColor = vec4(destColor, 1.0);
}