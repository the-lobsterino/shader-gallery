/*
R1:GLSL Sandboxでレイトレーシングを実装

球と平面に対して ray と交差判定を行い、シェーディングした。
その際に、 ray を反射させることで、反射面が映るようにした。

カメラの位置と向きは回転するようにして、常に原点周辺を向くようにした。


*/

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



struct Ray{ 
	vec3 ori; 
	vec3 dir; 
};
struct Plane{
	vec3 pos;
	vec3 norm;
	vec3 col;
};
struct Sphere{
	float r;
	vec3 cen;
	vec3 col;
};
struct Intersection{
	int hit;
	vec3 point;
	vec3 norm;
	vec3 col;
	float dist;
	vec3 rayDir;
};
	
const vec3 LDR = vec3(0.577);
const int REF_NUM = 1;
const float EPS = 0.0001;

// 平面との交差
void intersectPlane(Ray ray, Plane plane, inout Intersection i){
    float d = -dot(plane.pos, plane.norm);
    float v = dot(ray.dir, plane.norm);
    float t = -(dot(ray.ori, plane.norm) + d) / v;
    if(t > EPS && t < i.dist){
	i.hit+=1;
        i.point = ray.ori +ray.dir * t;
        i.norm = plane.norm;
        float d = clamp(dot(i.norm, LDR), 0.1, 1.0);
        float m = mod(i.point.x, 2.0);
        float n = mod(i.point.z, 2.0);
        /*
	if((m > 1.0 && n > 1.0) || (m < 1.0 && n < 1.0)){
            d *= 0.5;
        }
	*/
        float f = 1.0 - min(abs(i.point.z), 25.0) * 0.04;
        i.col = plane.col * d * f;
        i.dist = t;
	i.rayDir = ray.dir;
    }
}

// 球との交差
void intersectSphere(Ray ray, Sphere sphere, inout Intersection i){
	vec3 a = ray.ori - sphere.cen;
	float b = dot(a, ray.dir);
	float c = dot(a,a) - (sphere.r * sphere.r);
	float d = b*b - c;
	if(d>0.0){
		float t = -b - sqrt(d);
		if(t>0.0 && t<i.dist){
			i.hit ++;
			i.point = ray.ori + ray.dir*t;
			i.norm = normalize(i.point - sphere.cen);
			float d = clamp(dot(LDR, i.norm),0.1,1.0);
			i.col = sphere.col*d;
			i.dist = t;
			i.rayDir = ray.dir;
		}
	}
}


	
	
void main( void ) {

	// gl_FragCoord: すべてのピクセルに対して同じシェーダのコードが実行
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution)/min(resolution.x,resolution.y);
	
	// Ray の定義
	Ray ray;
	ray.ori = vec3(sin(time*0.1)*10.0, 1.0,cos(time*0.1)*10.0);
	ray.dir = normalize(-ray.ori+vec3(cos(time*0.1),0.0,-sin(time*0.1))*pos.x*5.0 +vec3(0.0, 1.0, 0.0)*pos.y*5.0);

	// sphere の定義
	Sphere sphere[3];
	sphere[0] = Sphere(1.0, vec3(-1.0,0.0,-1.0)+ vec3(mouse.x,0.0,mouse.y)*5.0,vec3(1.0,1.0,1.0)) ;
	sphere[1] = Sphere(0.8, vec3(2.0,-0.2,0.0),vec3(1.0,0.0,0.0));
	sphere[2] = Sphere(0.5, vec3(0.0,-0.5,3.0),vec3(0.0,0.0,1.0));

	
	// plane
	Plane plane[6];
	plane[0] = Plane(vec3(0.0,-1.0,0.0),vec3(0.0,1.0,0.0),vec3(1.0));
	plane[1] = Plane(vec3(-10.0, 0.0,0.0),vec3(1.0,0.0,0.0),vec3(1.0));
	plane[2] = Plane(vec3(0.0, 0.0,-10.0),vec3(0.0,0.0,1.0),vec3(1.0));
	plane[3] = Plane(vec3(0.0,6.0,0.0),normalize(vec3(0.0,1.0,0.0)),vec3(1.0));
	plane[4] = Plane(vec3(10.0, 0.0,0.0),vec3(1.0,0.0,0.0),vec3(1.0));
	plane[5] = Plane(vec3(0.0, 0.0,10.0),vec3(0.0,0.0,1.0),vec3(1.0));
	
	Intersection inter = Intersection(0,vec3(0.0),vec3(0.0),vec3(0.0), 1.0e30,vec3(0.0));
	vec3 destCol = vec3(0.0);
	vec3 tmpCol = vec3(1.0);
	Ray q = ray;
	// intersection
	for(int ref=0; ref<REF_NUM; ref++){
		for(int i=0; i<3; i++){
			intersectSphere(q,sphere[i],inter);
		}
		for(int i=0; i<6; i++){	
			plane[i].col *=0.5;
			intersectPlane(q,plane[i],inter);
		}
		if(inter.hit<ref) break;
		q.ori = inter.point + inter.norm * EPS;
		q.dir = reflect(inter.rayDir, inter.norm);
		tmpCol *= inter.col;
		destCol += tmpCol;
	}
	
	gl_FragColor = vec4(destCol, 1.0);
	
}