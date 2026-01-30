// 05201002
//カメラをマウスで動かせるようにした.

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Sphere {
	float radius;
	vec3 center;
};

struct Intersect{
	bool hit;
	vec3 n;
	vec3 p;
};
	
vec3 generate_camera_ray(vec2 pixel,vec3 origin){//光線を作る
	float film_w = 10.0;
	float film_h = 10.0;
	
	float x = film_w * pixel.x;
	float y = film_h * pixel.y;
	
	float z = 10.0;
	
	return normalize(vec3(x,y,z)-origin);
}

Intersect intersect(vec3 ray,Sphere sphere,vec3 origin){ //交差点の確認、その座標の計算、法線ベクトルの計算、
	float a = ray.x * ray.x + ray.y * ray.y + ray.z * ray.z;
	float b = ray.x * (origin.x-sphere.center.x) + ray.y * (origin.y-sphere.center.y) + ray.z * (origin.z-sphere.center.z);
	float c = (origin.x-sphere.center.x) * (origin.x-sphere.center.x) + (origin.y-sphere.center.y) * (origin.y-sphere.center.y) + (origin.z-sphere.center.z) * (origin.z-sphere.center.z) - sphere.radius * sphere.radius;
	
	float D_dash = b * b - a * c;
	if (D_dash > 0.0){
		float t = min((b+sqrt(D_dash))/a,(b-sqrt(D_dash)/a));
		vec3 p = origin + t * ray;
		vec3 n = normalize(p - sphere.center);
		return Intersect(true,n,p);
	}else{
		return Intersect(false,vec3(0,0,0),vec3(0,0,0));
	}
}

float shade(float phi,vec3 light,vec3 n,vec3 p){ // Basic Shading を用いたシェーディング
	vec3 l = light;
	float r = sqrt((light.x-p.x)*(light.x-p.x) + (light.y-p.y)*(light.y-p.y) + (light.z-p.z)*(light.z-p.z));
	return (phi * (n.x*l.x+n.y*l.y+n.z*l.z)) / ( 4.0 * 3.1415 * r * r );
}

void main( void ) {
	
	vec3 c_from = vec3(0.0,0.0,0.0)+vec3(mouse,0.0);
	vec2 pixel = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x,resolution.y);
	
	vec3 ray = generate_camera_ray(pixel,c_from);

	Sphere sphere1;
	sphere1 = Sphere(3.0,vec3(0.0,0.0,-5.0));

	vec3 lightDir = normalize(vec3(1.0,1.0,0.2));
	float brightness = 300.0;
	
	vec3 col = vec3(0,0,0);
	
	Intersect hit = intersect(ray,sphere1,c_from);
	
	if (hit.hit){	
		float e = shade(brightness,lightDir,hit.n,hit.p);
		col = vec3(e,e,e);
	}
	gl_FragColor = vec4( col, 1.0); 
}