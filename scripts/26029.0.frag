#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2  resolution;

//光源
struct Ray{
	vec3 origin;
	vec3 direction;
};
	
//光の方向
struct Sphere{
	float radius;
	vec3  position;
	vec3  color;
};
	
//級の半径、位置、色
struct Intersection{
	bool hit;
	vec3 hitPoint;
	vec3 normal;
	vec3 color;
};
	
//交差ポイント
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

//交差しているか確認、交差していたら交差ポイントの構造体を返す
void main(void){
	// fragment position
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	// ray init
	Ray ray;
	ray.origin = vec3(0.0, 0.0, 5.0);
	ray.direction = normalize(vec3(p.x, p.y, -1.0));
	
	// sphere init
	Sphere sphere;
	sphere.radius = 1.0;
	sphere.position = vec3(cos(time), sin(time), cos(time * 3.0));
	sphere.color = vec3(1.0);
	
	// hit check
	Intersection i = intersectSphere(ray, sphere);
	gl_FragColor = vec4(i.color, 1.0);
}
