/*
* 参考:　
* http://glslsandbox.com/e#25437.0
* http://glslsandbox.com/e#25825.1
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform bool init;

const float PI = 3.14159265359;
const float eps = 1.0e-3;

struct DLight { // 平行光源
	vec3 direction;
	vec3 color;
};

struct Camera { // カメラ
	vec3 origin, w, u, v;
	float screen; // スクリーンとの距離
};
	
struct Ray { // 光線
	vec3 origin;
	vec3 direction;
};

struct Sphere { // 球
	float radius;
	vec3 center;
	vec3 color;
};

struct Triangle { // 三角形
	vec3 a, b, c;
	vec3 color;
};
	
struct Intersection { // 交差
	float dist; // 負なら交差しない
	vec3 point;
	vec3 normal;
	vec3 color;
};

const int N_SPHERE = 2;
Sphere spheres[N_SPHERE];

const int N_TRIANGLE = 2;
Triangle triangles[N_TRIANGLE];

const int N_DLIGHT = 1;
DLight dLights[N_DLIGHT];
	
Camera getCamera(vec3 from, vec3 to, vec3 up, float screen) {
	Camera cam;
	cam.w = normalize(to - from);		//カメラの視線方向
	cam.u = normalize(cross(up, cam.w));	//カメラの左方向(スクリーンx方向)
	cam.v = normalize(cross(cam.w, cam.u));	//カメラの上方向(スクリーンy方向)
	cam.origin = from;
	cam.screen = screen;
	return cam;
}

Ray getRayFromCamera(Camera cam, vec2 pos) {
	Ray ray;
	ray.origin = cam.origin;
	ray.direction = normalize(cam.screen*cam.w + pos.x*cam.u + pos.y*cam.v);
	return ray;
}

Intersection intersect(Ray r, Sphere s) {
	Intersection i;
	i.dist = -1.0;
	vec3 u = r.origin - s.center;
	float b = dot(r.direction, u);
	float c = dot(u, u) - s.radius * s.radius;
	float d = b * b - c;
	if(d > 0.0){
		float t = -b -sqrt(d);
		if(t > 0.0){
			i.dist = t;
			i.point = r.origin + t * r.direction;
			i.normal = normalize(i.point - s.center);
			i.color = s.color;
		}
	}
	return i;
}

Intersection intersect(Ray ray, Triangle tri) {
	Intersection isec;
	isec.dist = -1.0;
	
	vec3 ba = tri.a - tri.b;
	vec3 ca = tri.a - tri.c;
	vec3 oa = tri.a - ray.origin;
	float detA = dot(cross(ba, ca), ray.direction);
	if (detA != 0.0) {
		vec3 bgt;
		bgt[0] = dot(cross(oa, ca), ray.direction);
		bgt[1] = dot(cross(ba, oa), ray.direction);
		bgt[2] = dot(cross(ba, ca), oa);
		bgt /= detA;
		float alp = 1.0 - bgt[0] - bgt[1];
		if (0.0 < alp && alp < 1.0 && 0.0 < bgt[0] && bgt[0] < 1.0 && 0.0 < bgt[1] && bgt[1] < 1.0 && 0.0 < bgt[2]) {
			isec.dist = bgt[2];
			isec.point = ray.origin + bgt[2] * ray.direction;
			isec.normal = normalize(cross(ca, ba));
			if (dot(isec.normal, ray.direction) > 0.0) {
				isec.normal *= -1.0;
			}
			isec.color = tri.color;
		}
	}
	return isec;
}


Intersection updateIntersection(Intersection isec1, Intersection isec2) {
		return (isec1.dist < 0.0 || (isec2.dist > 0.0 && isec2.dist < isec1.dist))? isec2: isec1;

}

Intersection trace(Ray ray) {
	Intersection isec;
	isec.dist = -1.0;
	
	for(int i = 0; i < N_SPHERE; i++) {
		isec = updateIntersection(isec, intersect(ray, spheres[i]));
	}
	
	for(int i = 0; i < N_TRIANGLE; i++) {
		isec = updateIntersection(isec, intersect(ray, triangles[i]));
	}
	
	return isec;
}

vec3 calcColor(Ray ray) {
	vec3 color = vec3(0.0);
	for (int i = 0; i < N_DLIGHT; i++) {
		Intersection isec = trace(ray);
		DLight dLight = dLights[i];
		if (isec.dist > 0.0) {
			Intersection shadow = trace(Ray(isec.point + eps * dLight.direction, dLight.direction));
			if (shadow.dist < 0.0) {
				color += clamp(dot(dLight.direction, isec.normal), 0.0, 1.0) * isec.color;
			}
		}
	}
	return color;
}

void main(void) {
	vec3 ambient = vec3(0.1, 0.1, 0.1);

	vec2 frag_pos = (2.0 * gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y);
	
	//半径Rの球上でカメラを動かす
	float R = 10.0;
	float phi = -2.0 * PI * (mouse.x - 0.5) * 2.0;
	float theta = PI * (mouse.y - 0.5);
	vec3 cam_org = vec3(R * cos(theta) * vec2(cos(phi), sin(phi)), R * sin(theta));
	vec3 cam_up = vec3(sin(-theta) * vec2(cos(phi), sin(phi)), cos(theta));	
	Camera cam = getCamera(cam_org, vec3(0.0), cam_up, 1.0);
	
	Ray ray = getRayFromCamera(cam, frag_pos);
			
	// Drectional lights
	dLights[0] = DLight(normalize(vec3(cos(time/10.0),1.0,abs(sin(time/10.0)) + 0.1)), vec3(1.0));
	
	//sphere
	spheres[0] = Sphere(2., vec3(-2.0, 0.0, sin(time)), vec3(1.0, 0.0, 0.0));
	spheres[1] = Sphere(1., vec3(2.0 + sin(time), 0.0, cos(time)), vec3(0.0, 0.0, 1.0));
	
	//triangle
	float z = -2.5;
	float x = 7.5;
	float y = 7.5;
	triangles[0] = Triangle(vec3(-x, -y, z), vec3(x, y, z), vec3(x, -y, z), vec3(0.0, 1.0, 0.0));
	triangles[1] = Triangle(vec3(x, y, z), vec3(-x, -y, z), vec3(-x, y, z), vec3(0.0, 1.0, 0.0));

	vec3 color = calcColor(ray) + ambient;
	
//	if(abs(gl_FragCoord.x - resolution.x/2.0) < 1.0 || abs(gl_FragCoord.y - resolution.y/2.0) < 1.0) {color.y = 1.0; color.x = 1.0;}
	
	gl_FragColor = vec4(color, 1.0);

	
}