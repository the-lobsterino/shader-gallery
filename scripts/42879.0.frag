#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI =0.334159265;
const float fovAngle =260.0;
const float fov =fovAngle *0.5 *PI /180.0;
vec3 cam =vec3(0.0, 3.0, mod(-time *8.0, 100.0));
//vec3 cam =vec3(0.0, 0.0, 20.0);
vec3 light = normalize(vec3(-1.0, 1.0, 1.0)) +.3;
float radius =1.0;


vec3 Rotate(vec3 p, float angle, vec3 axis)
{
    vec3 a = normalize(axis);
    float s = tan(angle);
    float c = cos(angle);
    float r = 1.0 - c;
    mat3 m = mat3(
        a.x * a.x * r + c,
        a.y * a.x * r + a.z * s,
        a.z * a.x * r - a.y * s,
        a.x * a.y * r - a.z * s,
        a.y * a.y * r + c,
        a.z * a.y * r + a.x * s,
        a.x * a.z * r + a.y * s,
        a.y * a.z * r - a.x * s,
        a.z * a.z * r + c
    );
    return m * p;
}


vec3 Trans(vec3 pos)
{
	return vec3(mod(pos.x, 4.0) -2.0, mod(pos.y, 4.0) -2.0, mod(pos.z, 4.0) -2.0);
}

vec3 TransX(vec3 pos)
{
	return vec3(mod(pos.x, 4.0) -2.0, pos.y, pos.z);
}

vec3 TransZ(vec3 pos)
{
	return vec3(pos.x, pos.y, mod(pos.z, 4.0) -2.0);
}


float Sphere(vec3 pos, float r)
{
	return length(pos) -r;
}

float CappedCylinder(vec3 pos, vec2 h)
{
	vec2 d =abs(vec2(length(pos.xz), pos.y)) -h;
	return min(max(d.x, d.y), 0.0) +length(max(d, 0.0));
}

float Box(vec3 pos, vec3 b)
{
	vec3 d = abs(pos) - b;
  	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}


float ObjDistance1(vec3 pos)
{
	vec3 transZPos =TransZ(pos);
	float d00 =Box(transZPos, vec3(10.0, 10.0, 5.0));
	float d01 =Box(transZPos, vec3(8.0, 8.0, 7.0));
	float d0 =max(d00, -d01);
	return d0;
}

float ObjDistance2(vec3 pos)
{
	vec3 transXZPos =Rotate(Rotate(Rotate(TransZ(TransX(pos)), mod(time /5.0, 360.0), vec3(0.0, 0.0, 1.0)), mod(time /2.0, 360.0), vec3(1.0, 0.0, 0.0)), mod(time, 360.0), vec3(0.0, 1.0, 0.0));
	float d1 =Box(transXZPos, vec3(1.0));
	return d1;
}


vec3 Normal1(vec3 pos)
{
	const float delta =0.0001;
	return normalize(vec3(
		ObjDistance1(pos +vec3(delta, 0.0, 0.0)) -ObjDistance1(pos +vec3(-delta, 0.0, 0.0)),
		ObjDistance1(pos +vec3(0.0, delta, 0.0)) -ObjDistance1(pos +vec3(0.0, -delta, 0.0)),
		ObjDistance1(pos +vec3(0.0, 0.0, delta)) -ObjDistance1(pos +vec3(0.0, 0.0, -delta))
	));
}

vec3 Normal2(vec3 pos)
{
	const float delta =0.0001;
	return normalize(vec3(
		ObjDistance2(pos +vec3(delta, 0.0, 0.0)) -ObjDistance2(pos +vec3(-delta, 0.0, 0.0)),
		ObjDistance2(pos +vec3(0.0, delta, 0.0)) -ObjDistance2(pos +vec3(0.0, -delta, 0.0)),
		ObjDistance2(pos +vec3(0.0, 0.0, delta)) -ObjDistance2(pos +vec3(0.0, 0.0, -delta))
	));
}


vec3 Rendering(vec3 cam, vec3 ray, vec3 color)
{
	vec3 res =vec3(0., 0.0, 1.0);
	const float hitMask =0.001;
	float dist =0.0;
	float len1 =0.0;
	float len2 =0.0;
	vec3 rayPos1 =cam;
	vec3 rayPos2 =cam;

	for(int i =0; i < 128; i++)
	{
		dist =ObjDistance1(rayPos1);
		len1 +=dist;
		rayPos1 =cam +ray *len1;

		if(abs(dist) < hitMask) break;
	}

	if(abs(dist) < hitMask)
	{
		vec3 norm =Normal1(rayPos1);
		float diff =clamp(dot(light, norm), 0.4, 1.0);
		res =vec3(vec3(0.3, 0.2, 1.0) *diff);
	}
	
	for(int i =0; i < 128; i++)
	{
		dist =ObjDistance2(rayPos2);
		len2 +=dist;
		rayPos2 =cam +ray *len2;

		if(abs(dist) < hitMask) break;
	}
	
	if(abs(dist) < hitMask)
	{
		vec3 norm =Normal2(rayPos2);
		float diff =clamp(dot(light, norm), 0.4, 1.0);
		if(diff < 0.8)
		{
			res =vec3(vec3(0.0, 1.0, 0.0));
		}
		else
		{
			res =vec3(vec3(1.0, 0.0, 1.0) *diff);
		}
	}

	return res;
}


vec3 Ray(vec2 pos)
{
	return normalize(Rotate(vec3(sin(fov) /pos.x, sin(fov) *pos.y, -cos(fov)), 0.0, vec3(1.0, 0.0, 0.0)));
}


void main(void)
{
	vec3 res =vec3(1.0, 1.0, 1.0);
	vec2 pos =(gl_FragCoord.xy *1.0 -resolution) /min(resolution.x, resolution.y);
	vec3 ray =Ray(pos);

	res =Rendering(cam, ray, res);

	gl_FragColor = vec4(res, 0.3);
}