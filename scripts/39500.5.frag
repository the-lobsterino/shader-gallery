#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdfFloor(vec3 p, float pos)
{
	return p.y - pos;
}

float sdfSphere(vec3 p, vec3 center, float radius)
{
	return distance(p, center) - radius;
}

float sdfThing(vec3 p, vec3 center, float radius)
{
	float tube1 = length(p.xy) - 1.8;
	float tube2 = length(p.zy) - 1.8;
	float tube3 = length(p.xz) - 1.8;
	float sphere = sdfSphere(p, center, radius);
	float both = max(sphere, max(max(-tube1, -tube2), tube3));
	return both;
}

float sdfScene(vec3 p)
{
	float d;

	d = sdfThing(p, vec3(0.0), 3.0);
	d = min(d, sdfSphere(p, vec3(0.0), 0.4) + sin(p.y * 5.0 + time * 10.0) * 0.1);
	d = min(d, sdfFloor(p, -4.0));
	
	return d;
}

vec2 rayCast(vec3 ro, vec3 rd)
{
	float d, t;
	for (int i = 0; i < 64; i++)
	{
		float precis = 0.0005 * t;
		d = sdfScene(ro + t * rd);
		t += d ;
		if (d < precis || d > 100.0)
			break;
	}
	return vec2(d, t);
}

void main( void ) {

	vec3 origin = vec3(sin(time) * 20.0, 0.0, -cos(time) * 20.0);
	vec3 target = vec3(0.0);
	float dist = 1.0;
	vec2 screenPos = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.yy;
	vec3 basisForward = normalize(target - origin);
	vec3 basisUp = vec3(0.0, 1.0, 0.0);
	vec3 basisRight = normalize(cross(basisForward, basisUp));
	vec3 dir = normalize(basisRight * screenPos.x + basisUp * screenPos.y + basisForward * dist);
	
	vec2 dt = rayCast(origin, dir);
	vec3 marchPos = origin + dt.y * dir;
	
	if (dt.x < 1.0)
	{
		vec3 lightDir = normalize(vec3(1.0, 1.0, -0.3));
		
		float eps = .01;
		vec3 normal = normalize(vec3(
			sdfScene(marchPos + vec3(eps, 0.0, 0.0)) - sdfScene(marchPos - vec3(eps, 0.0, 0.0)),
			sdfScene(marchPos + vec3(0.0, eps, 0.0)) - sdfScene(marchPos - vec3(0.0, eps, 0.0)),
			sdfScene(marchPos + vec3(0.0, 0.0, eps)) - sdfScene(marchPos - vec3(0.0, 0.0, eps))));
		
		vec2 shadow = rayCast(marchPos + normal * 0.01, lightDir);
		
		float light = 0.3;
		if (shadow.x >= 0.1)
			light += max(dot(normal, lightDir) * 0.5, 0.0);
		gl_FragColor = vec4(vec3(light), 1.0);
	}
	else
	{
		gl_FragColor = vec4(vec3(0.0), 1.0);
	}
}