#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 DrawPoint(vec2 pix, vec2 center, vec3 color, vec3 oldColor)
{
	vec2 v = pix - center;
	float distSq = dot(v, v);
	return distSq < 0.001 ? color : distSq < 0.0015 ? vec3(9) : oldColor;
}

float EdgeFunc(vec2 pos, vec2 a, vec2 b)
{
	return (pos.x - a.x) * (b.y - a.y) - (pos.y - a.y) * (b.x - a.x);
}

vec3 FillTriangle(vec2 pos, vec2 a, vec2 b, vec2 c, vec3 color)
{
	bool inside = EdgeFunc(pos, a, b) <= 0.0 && EdgeFunc(pos, b, c) <= 0.0 && EdgeFunc(pos, c, a) <= 0.0;
	return inside ? color : vec3(0);
}

vec3 RenderUnfoldOctahedron(vec2 pos, vec4 minMax)
{
	vec2 innerPos = (pos - minMax.xy) / (minMax.zw - minMax.xy);
	vec2 a = vec2(  0,  0);
	vec2 b = vec2(0.5,  0);
	vec2 c = vec2(  1,  0);
	vec2 d = vec2(  0,.4);
	vec2 e = vec2(0.5,0.4);
	vec2 f = vec2(  1,0.5);
	vec2 g = vec2(  0,  2);
	vec2 h = vec2(0.5,  1);
	vec2 i = vec2(  1,  1);
	vec3 color = vec3(0);
	color += FillTriangle(innerPos, a, b, d, vec3(1, 0, 0));
	color += FillTriangle(innerPos, d, b, e, vec3(0, 1, 0));
	color += FillTriangle(innerPos, b, f, e, vec3(0, 0, 1));
	color += FillTriangle(innerPos, b, c, f, vec3(1, 0, 1));
	color += FillTriangle(innerPos, g, d, h, vec3(1, 1, 0));
	color += FillTriangle(innerPos, d, e, h, vec3(0, 1, 1));
	color += FillTriangle(innerPos, h, e, f, vec3(0.8, 0.5, 0.1));
	color += FillTriangle(innerPos, h, f, i, vec3(1, 1, 1));
	return color;
}

vec3 RenderUnfoldHemiOctahedron(vec2 pos, vec4 minMax)
{
	vec2 innerPos = (pos - minMax.xy) / (minMax.zw - minMax.xy);
	vec2 a = vec2(  0,  0);
	vec2 b = vec2(  1,  0);
	vec2 c = vec2(0.5,2.5);
	vec2 d = vec2(  0,  1);
	vec2 e = vec2(  1,  1);
	vec3 color = vec3(0);
	color += FillTriangle(innerPos, c, a, b, vec3(1, 0, 0));
	color += FillTriangle(innerPos, c, b, e, vec3(0, 1, 0));
	color += FillTriangle(innerPos, c, e, d, vec3(0, 0, 1));
	color += FillTriangle(innerPos, c, d, a, vec3(1, 1, 0));
	return color;
}

vec2 SphereToUv(vec3 dir)
{
	float norm = dot(abs(dir), vec3(1));
	vec2 result = (dir.xy / norm);
	if (dir.z < 0.0)
	{
		vec2 signNoZero = mix(vec2(-1), vec2(1), vec2(greaterThanEqual(result, vec2(0))));
		result = (vec2(1.0) - abs(result)) * signNoZero;
	}
	return result * 0.5 + 0.5;
}

vec2 HemisphereToUv(vec3 dir)
{
	float norm = dot(abs(dir), vec3(1));
	vec2 result = (dir.xy / norm);
	return vec2(result.x+result.y, result.x-result.y) * 0.5 + 0.5;
}

struct Ray
{
	vec3 o;
	vec3 d;
};

float IntersectSphere(vec3 o, vec3 d)
{
	float q = dot(d, -o);
	float oSq = dot(-o, -o);
	float r = oSq - q*q;
	if (r < 1.0)
	{
		return q - (1.0 - r);
	}
	return -1.0;
}

Ray GetCameraRay(vec2 pos, vec4 canvasMinMax, mat3 rot)
{
	vec2 innerPos = (pos - canvasMinMax.xy) / (canvasMinMax.zw - canvasMinMax.xy);
	vec2 innerPosm11 = innerPos * 2.0 - 1.0;
	if (any(greaterThan(abs(innerPosm11), vec2(1.0))))
		return Ray(vec3(-1e38), vec3(-1e38));
	vec3 target = vec3(0);
	vec3 origin = vec3(0, -1.5, 0) * rot;
	vec3 forward = normalize(target - origin);
	vec3 left = normalize(cross(-forward, vec3(0, 0, 1)));
	vec3 up = normalize(cross(forward, left));
	return Ray(origin, normalize(innerPosm11.x * left + innerPosm11.y * up + forward));
}

vec3 GetSphereColor(vec3 normal)
{
	vec2 pos = SphereToUv(normal);
	return RenderUnfoldOctahedron(pos, vec4(0, 0, 1, 1));
}

mat3 GetRotation(vec2 pos, vec4 mouseMinMax)
{
	vec2 innerPos = (pos - mouseMinMax.xy) / (mouseMinMax.zw - mouseMinMax.xy);
	vec2 innerPosm11 = innerPos * 2.0 - 1.0;
	vec2 angles = vec2(0);
	//if (all(lessThanEqual(abs(innerPosm11), vec2(1.0))))
		angles = innerPosm11 * 3.1415 * vec2(5.0, 0.5);
	mat3 rx = mat3(1, 0, 0, 0, cos(angles.y), sin(angles.y), 0, -sin(angles.y), cos(angles.y));
	mat3 rz = mat3(cos(angles.x), sin(angles.x), 0, -sin(angles.x), cos(angles.x), 0, 0, 0, 1);
	return rz;
}

void main( void ) {
	
	vec2 pos = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;
	pos.x *= resolution.x / resolution.y;
	
	vec3 color = vec3(0);

	vec4 octaBounds = vec4(0.5, 0.0, 1.5, 1.0);
	color += RenderUnfoldOctahedron(pos, octaBounds);
	
	vec4 hemiOctaBounds = vec4(0.5, -1, 1.5, 0.0);
	color += RenderUnfoldHemiOctahedron(pos, hemiOctaBounds);
	
	vec3 dir;
	
	vec4 canvasBounds = vec4(-1.5, -0.5, -0.5, 0.5);
	mat3 rot = GetRotation(mouse, canvasBounds);
	Ray ray = GetCameraRay(pos, canvasBounds, rot);
	if (ray.o.x > -1e38)
	{
		float t = IntersectSphere(ray.o, ray.d);
		if (t > 0.0)
		{
			vec3 p = ray.o + t* ray.d;
			vec3 normal = normalize(p);
			vec3 lightDir = normalize(-vec3(-10.5, -5.5, 0.0));
			vec3 objColor = GetSphereColor(normal);
			color += pow(max(0.0, dot(-lightDir, normal)) * vec3(0.9) * objColor, vec3(2.0));
			color += pow(max(0.0, dot(lightDir, normal)) * vec3(0.9) * objColor, vec3(2.0));
			color += objColor * vec3(0.1, 0.1, 0.1);
		}
	}
	
	vec2 m = mouse * 2.0 - 1.0;
	m.x *= resolution.x / resolution.y;
	if (any(lessThan(m, vec2(-1)))) m = vec2(0.0);
	if (any(greaterThan(m, vec2(1)))) m = vec2(0.0);
	//color = vec3(m, 0.0);
	ray = GetCameraRay(m, canvasBounds, rot);
	if (ray.o.x > -1e38)
	{
		float t = IntersectSphere(ray.o, ray.d);
		if (t > 0.0)
		{
			vec3 p = ray.o + t* ray.d;
			dir = normalize(p);
		}
	}
	
	vec2 point = SphereToUv(dir);
	vec2 point2 = HemisphereToUv(dir);
	color = DrawPoint(pos, octaBounds.xy + point * (octaBounds.zw-octaBounds.xy), vec3(0.5, 0.5, 0.5), color);
	color = DrawPoint(pos, hemiOctaBounds.xy + point2 * (hemiOctaBounds.zw-hemiOctaBounds.xy), vec3(0.5, 0.5, 0.5), color);

	gl_FragColor = vec4(color, 1.0);
}