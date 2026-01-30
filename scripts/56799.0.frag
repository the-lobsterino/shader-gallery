#ifdef GL_ES 
precision highp float;
#endif

#define hit_background -1
#define hit_sphere 1
#define hit_plane 2
#define hit_light 10

#define pi 3.1415
// при меньшем эпсилон появляются артефакты на сфере. Возможно, не самый лучший способ избавляться от них
#define eps 0.0005
#define INF 1e5

#define max_bounces 4

uniform float time;
uniform vec2 resolution;


//========================================================================================================

// материал, из которого сделаны объекты
struct Material {
	vec3 color;		// цвет объекта
	float refl;		// коэффициент отражения (0 - матовый, 1 - зеркальный)
};

// информация о пересечении луча с каким-либо объектом сцены
struct Hit 
{
	int type;		// тип объекта
	vec3 pos;		// точка пересечения
	vec3 normal;		// нормаль к объекту в точке пересечения
	Material material;	// материал объекта
};

// сфера
struct Sphere 
{
	vec3 crd;		// координаты
	float r;		// радиус
	Material material;	// материал сферы
};

	

//========================================================================================================

// угол зрения в градусах
float fov = 90.0;			

// объекты сцены:
const int spheres_count = 2;
const int lights_count = 2;
Sphere spheres[spheres_count];
Sphere lights[lights_count];

void setScene() 
{
	spheres[0] = Sphere(vec3(0.0, 1.0, 0.0), 1.0, Material(vec3(0.8, 0.2, 0.2), 0.4));
	spheres[1] = Sphere(vec3(2.0, 1.0, 0.0), 1.0, Material(vec3(0.2, 0.2, 0.8), 0.4));
	lights[0] = Sphere(vec3(3.0, 3.0, 3.0), 0.1, Material(vec3(1.0, 1.0, 1.0), 0.0));
	//lights[1] = Sphere(vec3(-3.0, 3.0, 4.0), 0.1, Material(vec3(1.0, 1.0, 1.0), 0.0));
	
	// двигаем источник света
	//lights[0].crd.xz = vec2(3.0 * cos(time), 3.0 * sin(time));
}


//========================================================================================================

// поиск точки пересчения со сферой
float intersectSphere(in vec3 ro, in vec3 rd, in Sphere sph) 
{	
	vec3 oc = ro - sph.crd;
	float b = dot(oc, rd);
	float c = dot(oc, oc) - sph.r*sph.r;
	float d = b*b - c;
	if (d < 0.0) return INF;
	float t = -b - sqrt(d);
	if (t < 0.0) return INF;
	return t;
}

// поиск точки пересечения с плоскостью
float iPlane(in vec3 ro, in vec3 rd) 
{
	// уравнение плоскости: y = 0 = ro.y + t*rd.y
	float t = -ro.y/rd.y;
	if (t < 0.0)
		return INF;
	return t;
}
// нормаль к плоскости
vec3 nPlane(in vec3 pos)
{
	return vec3(0.0, 1.0, 0.0);	
}



Hit intersect(vec3 ro, vec3 rd) 
{
	// при достаточно большом t на горизонте некоторые пиксели не доходят до источника света:
	// при отслеживании луча от точки касания до источника света они попадают в бекграунд. 
	// происходит такое, если радиус источника света маленький, следовательно, попадание в него лучом
	// нельзя рассчитать, не уперевшись в погрешность float. Выхода два: увеличивать радиус или уменьшать t
	float t = 150.0;	
	
	// информация о пересечении
	int hit_type = hit_background;		// тип пересечения
	vec3 pos = vec3(0.0);			// точка пересечения
	vec3 normal = vec3(0.0);		// нормаль к объекту в точке пересечения
	Material material = Material(vec3(0.5, 0.6, 0.7), 0.0);
	
	// проверяем пересечение со сферами
	for (int i = 0; i < spheres_count; i++) 
	{
		float tmp = intersectSphere(ro, rd, spheres[i]);
		if (tmp < t) 
		{
			t = tmp;
			hit_type = hit_sphere;
			material = spheres[i].material;
			pos = ro + rd*t;
			normal = normalize(pos - spheres[i].crd);
		}
	}
	
	// проверяем пересечение с плоскостями
	float tpla = iPlane(ro, rd);
	if (tpla < t)
	{
		t = tpla;
		hit_type = hit_plane;
		material.color = vec3(0.4, 0.4, 0.4);
		material.refl = 0.2;
		pos = ro + rd*t;
		normal = nPlane(pos);
	}
	
	// проверяем пересечение с источниками света
	for (int i = 0; i < lights_count; i++)
	{
		float tmp = intersectSphere(ro, rd, lights[i]);
		if (tmp < t) 
		{
			t = tmp;
			hit_type = hit_light;
			material = lights[i].material;
			pos = ro + rd*t;
			normal = normalize(pos - lights[i].crd);			
		}
	}

	// отводим точку пересечения с объектом чуть ближе к камере, 
	// чтобы лучи из этой точки не столкнулись с этим же объектом
	pos -= rd * eps;
	
	return Hit(hit_type, pos, normal, material);		
}

vec3 determineColor(Hit hit) 
{
	// если луч ничего не пересекает или пересекает источник света, то дальше цвет считать не надо
	if (hit.type == hit_background || hit.type == hit_light)
		return hit.material.color;
	
	vec3 diffuse = vec3(0.0);
	vec3 ambient = vec3(0.2);
	
	for (int i = 0; i < lights_count; i++) 
	{	
		// испускаем из этой точки луч до источника света
		vec3 ro = hit.pos; 
		vec3 rd = normalize(lights[i].crd - hit.pos);
		
		Hit lightHit = intersect(ro, rd);
		
		// если точка видима для источника света, добавляем диффузную составлящую от этого источника		
		if (lightHit.type == hit_light) 
			diffuse += (max(0.0, dot(rd, hit.normal))) * lightHit.material.color;
	}
	
	vec3 color = hit.material.color * clamp((diffuse + ambient), 0.0, 1.0);
	
	return color;
}


// трассировка лучей по формуле color = color + reflColor * refl;
vec3 traceRay(vec3 ro, vec3 rd) 
{
	vec3 color = vec3(0.0);
	float specMod = 1.0;
	for (int i = 0; i < max_bounces; i++) {
		// проверяем, пересекает ли луч какой-нибудь объект сцены
		Hit hit = intersect(ro, rd);
			
		ro = hit.pos;
		rd = reflect(rd, hit.normal);
				
		// цвет пикселя
		color += specMod * determineColor(hit);
		specMod *= hit.material.refl;
		
		if (hit.type == hit_background || hit.type == hit_light)
			break;
	}
	
	return color;
}

// трассировка лучей по формуле color = mix(color, reflColor, refl);
vec3 traceRayX(vec3 ro, vec3 rd) 
{		
	vec3 colors[max_bounces];
	float refls[max_bounces];
	
	for (int i = 0; i < max_bounces; i++) {
		Hit hit = intersect(ro, rd);
		colors[i] = determineColor(hit);
		refls[i] = hit.material.refl;
		
		if (hit.type == hit_background || hit.type == hit_light)
			break;
		
		ro = hit.pos;
		rd = reflect(rd, hit.normal);
	}
	
	vec3 color = colors[max_bounces - 1];
	
	for (int j = max_bounces - 2; j >= 0; j--) {
		color = mix(colors[j], color, refls[j]);
	}
	return color;	
}


void main( void ) 
{	
	// устанавливаем объекты сцены
	setScene();
	
	// считаем пиксельные координаты с учетом соотношения сторон разрешения
	vec2 uv = (-1.0 + 2.0 * gl_FragCoord.xy / resolution.xy) / vec2(1.0, resolution.x / resolution.y);
	
	// расчет коэффициента для вектора направления, соответствующего выбранному полю зрения, kFov > 0
	float kFov = 1.0 / tan(radians(fov / 2.0));		
		
	// генерируем луч из точки ro с направлением rd
	vec3 ro = vec3 (0.0, 1.0, 9.0);
	vec3 rd = normalize(vec3 (uv, -kFov));
		
	// трассируем луч
	vec3 col = traceRayX(ro, rd);
	
	gl_FragColor = vec4(col, 1.0);
}