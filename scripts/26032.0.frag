#ifdef GL_ES
precision mediump float;
#endif

uniform float time;		//時間
uniform vec2  resolution;	//スクリーンサイズ

//光源の構造体
struct Ray{
	vec3 origin;		//始点
	vec3 direction;		//方向
};
	
//球の構造体
struct Sphere{
	float radius;		//半径
	vec3  position;		//座標
	vec3  color;		//色
};
	
//交差情報の構造体
struct Intersection{
	bool hit;		//交差判定のフラグ
	vec3 hitPoint;		//交点の座標
	vec3 normal;		//交点位置の法線
	vec3 color;		//交点位置の色
};
	
//交差しているか確認、交差していたら交差ポイントの構造体を返す
Intersection intersectSphere(Ray R, Sphere S){
	Intersection i;
	vec3  a = R.origin - S.position;
	float b = dot(a, R.direction);
	float c = dot(a, a) - (S.radius * S.radius);
	float d = b * b - c;
	if(d > 0.0){
		float time = -b - sqrt(d);
		if(time > 0.0){
			i.hit = true;
			i.hitPoint = R.origin + R.direction * time;
			i.normal = normalize(i.hitPoint - S.position);
			float d = clamp(dot(normalize(vec3(1.0)), i.normal), 0.1, 1.0);
			i.color = S.color * d;
			return i;
		}
	}
	i.hit = false;
	i.hitPoint = vec3(0.0);
	i.normal = vec3(0.0);
	i.color = vec3(0.0);
	return i;
}

void main(void){
	// fragment position
	// gl_FragCoord 処理するピクセルの座標
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	// ray init
	Ray ray;
	ray.origin = vec3(0.0, 0.0, 5.0);
	ray.direction = normalize(vec3(p.x, p.y, -1.0));
	
	// sphere init
	Sphere sphere;
	sphere.radius = 1.0;
	sphere.position = vec3(cos(5.0 * time), sin(5.0 * time), 0);
	sphere.color = vec3(1.0);
	
	// hit check
	// gl_FragColor 処理するピクセルの色
	Intersection i = intersectSphere(ray, sphere);
	gl_FragColor = vec4(i.color, 1.0);
}