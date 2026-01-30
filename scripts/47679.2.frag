//2018/06/28
//Hiroki Harada

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//位置、回転（基準方向）、サイズ
struct Transform
{
	vec3 position;
	vec3 rotation;
	float scale;
};

//レイ
struct Ray
{
	Transform transform;
};

//ライト
struct DirectionalLight
{
	Transform transform;	
};

//平面
struct Plane
{
	Transform transform;
	vec3 color;
};

//球
struct Sphere
{
	Transform transform;
	vec3 color;
};

//レイが物体と交差したときの情報（奥にある物体から順に更新していく）
struct RayCastHit
{
	vec3 point;
	vec3 normal;
	vec3 color;
};

//ライトのインスタンス	
DirectionalLight light;


//レイキャスト（平面）
void rayCast(Ray ray, Plane plane, inout RayCastHit hit)
{
	float t = (-dot(ray.transform.position, plane.transform.rotation) 
		   +dot(plane.transform.position, plane.transform.rotation)
		  )/dot(ray.transform.rotation, plane.transform.rotation);

	if(0.0<t && t<1.0e+30){
		hit.point = ray.transform.position + ray.transform.rotation * t;
		hit.normal = plane.transform.rotation;
		
		float lum = 0.0;
		float xm2 = mod(hit.point.x, 2.0);
		float zm2 = mod(hit.point.z, 2.0);
		if(xm2<1.0 && zm2<1.0 || xm2>1.0 && zm2>1.0)
		{
			lum = clamp(dot(hit.normal, light.transform.rotation),0.1,1.0);
		}
		else
		{
			lum = clamp(dot(hit.normal, light.transform.rotation),0.1,1.0) / 2.0;
		}
		float fog = 1.0 - min(abs(hit.point.z),25.0) * 0.04;
		hit.color = plane.color * lum * fog;		
	}	
}

//レイキャスト（球）
void rayCast(Ray ray, Sphere sphere, inout RayCastHit hit)
{
	vec3 a = ray.transform.position - sphere.transform.position;
	float b = dot(a,ray.transform.rotation);
	float c = dot(a,a) - sphere.transform.scale * sphere.transform.scale / 4.0;
	float t = -b - sqrt(b * b - c);
	if(0.0<t && t<1.0e+30 && 0.0<b*b-c){
		hit.point = ray.transform.position + ray.transform.rotation * t;
		hit.normal = normalize(hit.point - sphere.transform.position);
		
		float lum = clamp(dot(light.transform.rotation, hit.normal),0.1,1.0);
		hit.color = sphere.color * lum;		
	}	
}


void main( void ) {
	//色を決定するディスプレイ座標を取得
	vec2 fragPos = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	//ライトを更新
	light.transform.position = vec3(0.0);
	light.transform.rotation = normalize(vec3((sin(time)+1.0)/2.0,1.0,vec3(cos(time)+1.0)));

	//レイを初期化
	Ray ray;
	ray.transform.position = vec3(0.0,0.0,5.0);
	ray.transform.rotation = normalize(vec3(fragPos.x, fragPos.y,-1.0));
	
	//平面を作成
	Plane plane;
	plane.transform.position = vec3(0.0,-1.0,0.0);
	plane.transform.rotation = normalize(vec3(sin(time),1.0,0.0));
	plane.color = vec3(1.0);
	
	//球を作成
	Sphere sphere;
	sphere.transform.position = vec3(sin(time),(sin(time*1.3)+1.0)/2.0,cos(time)+2.0);
	sphere.transform.scale = 1.0;
	sphere.color = vec3((sin(time)+1.0)/2.0,(sin(time*1.1)+1.0)/2.0,(sin(time*1.2)+1.0)/2.0);
	
	//レイキャスト結果を初期化
	RayCastHit r;
	r.point = vec3(0.0);
	r.normal = vec3(0.0,1.0,0.0);
	r.color = vec3(0.0);
	
	//レイキャスト
	rayCast(ray, plane, r);
	rayCast(ray, sphere, r);

	//色を更新
	gl_FragColor = vec4(r.color,1.0);
}