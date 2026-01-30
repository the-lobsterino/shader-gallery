#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Ray{
	vec3 origin;
	vec3 direction;
};
	
struct Sphere{
	float radius;
	vec3 center;
	vec3 color;
};

struct Cone{
	float height;
	float coef;
	vec3 offset;
	vec3 color;
};
	
struct Intersection{
	bool intersect;
	vec3 position;
	vec3 norm_vec;
	vec3 color;
};
	
Intersection intersectCone(Ray R, Cone C){
	Intersection i;
	//t^2(xd^2+yd^2-zd^2)+2t(xo * xd + yo * yd - zo * zd) + (xo^2 + yo^2 - zo^2) = 0
	vec3 dir = R.direction;
	vec3 o = R.origin - C.offset;
	float a = C.coef * (dir.x * dir.x + dir.z * dir.z) - dir.y * dir.y;
	float b_half = C.coef * (o.x * dir.x + o.z * dir.z) - o.y * dir.y;
	float c = C.coef * (o.x * o.x + o.z * o.z) - o.y * o.y;
	float d = b_half * b_half - a * c;
	if(d > 0.0){
		float t = (- b_half - sqrt(d)) / a;
		if(t > 0.0 && o.y + t * dir.y < 0.0 && o.y + t * dir.y > -C.height){
			i.intersect = true;
			i.position = R.origin + R.direction * t;
			i.norm_vec = normalize(2.0 * vec3( i.position.x, -i.position.y,  i.position.z));
			float d = min(max(dot(normalize(vec3(1.0)), i.norm_vec), 0.1), 1.0);
			i.color = C.color * d;
			return i;
		}
	}
	i.intersect = false;
	i.position = vec3(0.0);
	i.norm_vec = vec3(0.0);
	i.color = vec3(0.0);
	return i;
}	

Intersection intersectSphere(Ray R, Sphere S){
	Intersection i;

	// d・d t^2 + 2d・(o - c)t + (o - c)・(o - c) - r^2 = 0 
	vec3 co = R.origin - S.center;
	float a = dot(R.direction, R.direction);
	float b_half = dot(R.direction, co);
	float c = dot(co, co) - S.radius * S.radius;
	float d = b_half * b_half - a * c;
	if(d > 0.0){
		float t = (- b_half - sqrt(d)) / a;
		if(t > 0.0){
			i.intersect = true;
			i.position = R.origin + R.direction * t;
			i.norm_vec = (i.position - S.center) / S.radius;
			float d = min(max(dot(normalize(vec3(1.0)), i.norm_vec), 0.1), 1.0);
			i.color = S.color * d;
			return i;
		}
	}
	i.intersect = false;
	i.position = vec3(0.0);
	i.norm_vec = vec3(0.0);
	i.color = vec3(0.0);
	return i;
}	

void main( void ) {

	vec2 position = ( gl_FragCoord.xy - resolution.xy * 0.5 ) / resolution.y;
	vec2 mousepos = vec2((mouse.x * 2.0 - 1.0) * resolution.x / min(resolution.x,resolution.y),
			     (mouse.y * 2.0 - 1.0) * resolution.y / min(resolution.x,resolution.y));
	Intersection i;

	
	//ray
	Ray ray;
	ray.origin = vec3(2.0 * mousepos.x, 2.0 * mousepos.y, 5.0);
	ray.direction = normalize(vec3(vec2(position), -1.0));
	
	//sphere
	Sphere sphere;
	sphere.radius = 1.0;
	sphere.center = vec3(0.0);
	sphere.color = vec3(1.0);
	
	//cone
	Cone cone;
	cone.coef = 5.0;
	cone.offset = vec3(1.0, 1.0, -2.0);
	cone.height = 3.0;
	cone.color = vec3(0.0, 0.5, 255.0);
	
	//check hit or not
	vec3 destColor = vec3(0.0);
	Intersection i_s = intersectSphere(ray, sphere);
	Intersection i_c = intersectCone(ray, cone);
	i_s.intersect && dot(i_s.position - ray.origin, i_s.position - ray.origin) <  dot(i_c.position - ray.origin, i_c.position - ray.origin) ?
	  i = i_s : i = i_c;
	gl_FragColor = vec4(i.color, 1.0);

}