#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159268;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;

const vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));


float dSphere(vec3 pos, vec3 offset, float size)
{
	return length(pos - offset) - size;
}

float dFloor(vec3 pos, float height)
{
	return dot(normalize(vec3(0.0, 1.0, 0.0)), pos) + height;
}

float dist_func(vec3 pos)
{
	return min(dFloor(pos, 1.0), dSphere(pos, vec3(0.0), 0.2));
}

vec3 getNormal(vec3 pos)
{
	const float ep = 0.0001;
	return normalize(vec3(
		dist_func(pos) - dist_func(pos + vec3(-ep, 0.0, 0.0)),
		dist_func(pos) - dist_func(pos + vec3(0.0, -ep, 0.0)),
		dist_func(pos) - dist_func(pos + vec3(0.0, 0.0, -ep))
	));
}

void main( void ) {

	vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	if(mod(time*30.0,30.0) > 15.0){
	position.x += atan(sin((time*300.0) +  gl_FragCoord.y)*0.03);
	}
	
	vec3 cameraPos = vec3(0.0, 0., 10.0);
	vec3 dir = normalize(vec3(position, 0.0) - cameraPos);
	float x = dir.x * sin(fov);
	float y = dir.y * sin(fov);
	float z = dir.z * cos(fov);
	vec3 ray = normalize(vec3(x, y, z));
	vec3 cur = cameraPos;
	
	vec3 color = vec3(0.0);
	
	vec3 offset = vec3(0.5);
	float size = 0.5;
	for (int i = 0; i < 512; i++)
	{
		float d = dist_func(cur);
		if (d < 0.0001)
		{
			vec3 n = getNormal(cur);
			float diff = dot(lightDir, n);
			color = vec3(diff);
			break;
		}
		cur += ray * d;
	}
	
	gl_FragColor = vec4(color, 1.0);
}