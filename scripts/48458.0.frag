#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Camera {
	vec3 pos;
	vec3 dir;
	vec3 sid;
	vec3 top;
};

struct Ray {
	vec3 ori;
	vec3 dir;
};

	
struct Material {
	vec3 col;
	float type;
};
	
struct Sphere {
	vec3 pos;
	float rad;
	Material mat;
};
	
struct RaycastResult {
	float dist;
	bool hit;
	vec3 norm;
	Material mat;
};
	
struct DirectionalLight {
	vec3 dir;
	vec3 col;
};
	
struct Plane {
	vec3 norm;
	float dist;
	Material mat;
};
	
Camera newCamera( vec3 p, vec3 d, vec3 x ) {
	Camera cam;
	cam.pos = p;
	cam.dir = d;
	cam.sid = x;
	cam.top = cross( cam.sid, cam.dir );
	return cam;
}

Camera lookAt( vec3 p, vec3 t ) {
	vec3 dir = normalize( t - p );
	return newCamera(
		p,
		dir,
		normalize( cross( dir, vec3( 0.0, 1.0, 0.0 ) ) )
	);
}

Ray newRay( vec3 o, vec3 d ) {
	Ray ray;
	ray.ori = o;
	ray.dir = d;
	return ray;
}

Ray perspective( Camera cam, vec2 p, float fov ) {
	Ray ray;
	return newRay(
		cam.pos,
		normalize( cam.sid * p.x + cam.top * p.y + cam.dir / tan( fov / 180.0 * PI ) )
	);
}

RaycastResult intersectRaySphere( Ray ray, Sphere sphere ) {
	
	RaycastResult result;
	
	vec3 p = sphere.pos - ray.ori;
	float a = dot(ray.dir, ray.dir);
	float b = dot(ray.dir, p);
	float c = dot(p, p) - sphere.rad * sphere.rad;
	
	float s = b * b - a * c;
	if (s < 0.0) return result;
	
	float a1 = (b - s) / a;
	float a2 = (b + s) / a;
	if (a1 < 0.0 || a2 < 0.0) return result;
	
	result.dist = min(a1, a2);
	result.hit = true;
	result.norm = normalize(ray.ori + ray.dir * result.dist - sphere.pos);
	result.mat = sphere.mat;
	
	return result;
}

RaycastResult intersectRayPlane(Ray ray, Plane plane) {
	RaycastResult result;
	
	float v = dot(plane.norm, ray.dir);
	float t = -(dot(plane.norm, ray.ori) + plane.dist) / v;
	
	if (t < 0.0)
	{
		return result;
	}
	
	result.norm = -plane.norm;
	result.dist = t;
	result.hit = true;
	result.mat = plane.mat;
	vec3 pos = floor(ray.ori + ray.dir * result.dist);
	result.mat.col = mod(pos.x + pos.z, 2.0) < 1.0 ? vec3(0.2, 0.2, 0.2) : vec3(1.0, 1.0, 1.0);
	return result;
}

vec3 hsv2rgb(vec3 hsv)
{
	float h = fract(hsv.x) * 6.0;
	float c = hsv.y;
	float x = c * ( 1.0 - abs( mod ( h, 2.0 ) - 1.0 ) );
	vec3 rgb = (hsv.z - c) * vec3(1.0, 1.0, 1.0);
	if (h < 1.0) return rgb + vec3(c, x, 0.0);
	if (h < 2.0) return rgb + vec3(x, c, 0.0);
	if (h < 3.0) return rgb + vec3(0.0, c, x);
	if (h < 4.0) return rgb + vec3(0.0, x, c);
	if (h < 5.0) return rgb + vec3(x, 0.0, c);
	return rgb + vec3(c, 0.0, x);
}

RaycastResult rayCast(Ray ray)
{
	Sphere sphere[16];
	
	for (int i = 0; i < 8; ++i)
	{
		float a = float(i) * PI * 2.0 / 8.0;
		sphere[i].pos = vec3(sin(a), -pow(fract(a + time) * 2.0 - 1.0, 2.0) + 1.0, cos(a)) * 2.0;
		sphere[i].rad = 0.5;
		sphere[i].mat.col = hsv2rgb(vec3(a - time * 0.3, 1, 1));
		sphere[i].mat.type = mod(float(i), 2.0);
	}
	
	Plane plane;
	plane.norm = normalize( vec3( 0.0, -1.0, 0.0 ) );
	plane.dist = -0.5;
	plane.mat.col = vec3( 0.2, 0.2, 0.2 );
	
	RaycastResult nearResult;
	
	for (int i = 0; i < 8; ++i)
	{
		RaycastResult result = intersectRaySphere( ray, sphere[i] );
		if (result.hit && ( !nearResult.hit || result.dist < nearResult.dist ) )
		{
			nearResult = result;
		}
	}
	{
		RaycastResult result = intersectRayPlane( ray, plane );
		if (result.hit && ( !nearResult.hit || result.dist < nearResult.dist ) )
		{
			nearResult = result;
		}
	}
	
	return nearResult;
}

float rand(vec4 co){
	return fract(sin(dot(co ,vec4(12.9898, 78.233, 33.33333, 44.44444))) * 43758.5453);
}

vec3 rayMarch(Ray ray, vec2 seed)
{
	DirectionalLight light;
	light.dir = normalize( vec3( 0.3, 1.0, 0.3 ) );
	light.col = vec3( 1.0, 1.0, 1.0 );
	
    vec3 col = vec3(1.0, 1.0, 1.0);
	for ( int i = 0; i < 4; ++i ) {
		RaycastResult result = rayCast(ray);
		if (!result.hit) break;
		
		vec3 pos = ray.ori + ray.dir * result.dist;
		
		vec3 newDir;
		if (result.mat.type < 1.0)
		{
            float unitZ = rand(vec4(seed, 0.0, time)) * 2.0 - 1.0;
            float radianT = rand(vec4(seed, 1.0, time + 1.0)) * PI * 2.0;
    	    newDir = normalize(vec3(
                sqrt(1.0 - unitZ * unitZ) * cos(radianT),
                sqrt(1.0 - unitZ * unitZ) * sin(radianT),
                unitZ
            ));
            if (dot(newDir, result.norm) < 0.0) newDir = -newDir;
		}
		else
		{
		    newDir = reflect(ray.dir, result.norm);
		}
		
		col *= result.mat.col * light.col;
		//col *= mix(result.mat.col * light.col, vec3(1.0, 1.0, 1.0), length(ray.ori + ray.dir * result.dist) * 0.01);
		
		ray.ori = pos;
		ray.dir = newDir;
		ray.ori += newDir * 0.001;
		
	}
	col = pow(col, vec3(1.0, 1.0, 1.0) / 2.1);
	return col;
}

void main(void) {
	vec2 uv = ( gl_FragCoord.xy - resolution.xy / 2.0 ) / resolution.y;
	
	float t = time;
	Camera cam = lookAt(
		vec3(sin( t ), 0.2, cos( t ) ) * 5.0,
		vec3(0.0, 0.0, 0.0 )
	);
	
	Ray ray = perspective(cam, uv, 45.0);
	
	vec3 col = vec3( 0.0, 0.0, 0.0 );
	for (int i = 0; i < 8; ++i)
	{
	    col += rayMarch(ray, uv + float(i));
	}
	col /= 8.0;
	
	gl_FragColor = vec4(col, 1.0);

}