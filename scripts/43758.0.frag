#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define saturate(x) clamp(x, 0.0, 1.0)

float sdSphere(const vec3 p, const float r)
{
	return length(p) - r;	
}

float map(const vec3 pos)
{
	float d1 = sdSphere(pos, 1.0) + 0.05 * sin(pos.x * 16.0 + time * 0.13) * cos(pos.y * 16.0 + time * 2.17) * sin(pos.z * 16.0 - time * 1.13);
	
	return d1;
}

vec3 getNormal(const vec3 p)
{
	vec2 eps = vec2(0.0, 0.02);
	vec3 n;
	n.x = map(p + eps.yxx) - map(p - eps.yxx);
	n.y = map(p + eps.xyx) - map(p - eps.xyx);
	n.z = map(p + eps.xxy) - map(p - eps.xxy);
	
	return normalize(n);
}

float trace(const vec3 ro, const vec3 rd, out vec3 pos, out int steps)
{
	float t = 0.0;
	const float MAX_DIST = 10.0;
	const float EPS = 0.002;
	const int MAX_STEPS = 64;
	for (int i = 0; i < MAX_STEPS; i++)
	{
		steps = i;
		if (t > MAX_DIST) return -1.0;
		pos = ro + rd * t;
		float h = map(pos);
		
		if (h <= EPS) return 1.0;
		
		t += h;
	}
	
	return -1.0;
}

vec3 render(const vec3 ro, const vec3 rd, out vec3 pos)
{
	int steps = 0;
	float t = trace(ro, rd, pos, steps);
	
	if (t == -1.0)
	{
		float smallStep = float(steps) * 0.03;
		return 1.0 - vec3(smallStep * smallStep);	
	}
	
	vec3 normal = getNormal(pos);
	
	vec3 lights[3];
	lights[0] = normalize(vec3(0.25, 0.25, 0.5));
	lights[1] = normalize(vec3(-0.1, -0.5, -0.3));
	lights[2] = normalize(vec3(-0.5, 0.5, 0.0));
	
	vec3 lightColours[3];
	lightColours[0] = vec3(0.5);
	lightColours[1] = vec3(0.5, 0.0, 0.0);
	lightColours[2] = vec3(0.1, 0.1, 0.8);
	
	vec3 albedo = vec3(0.1, 0.2, 0.2);
	
	vec3 Fd = vec3(0.0);
	vec3 Fs = vec3(0.0);
	vec3 v = normalize(pos);
	for (int i = 0; i < 3; i++)
	{
		vec3 lightDir = lights[i];
		float diffuse = saturate(dot(normal, lightDir));
		float specular = pow(diffuse, 12.0);
		Fd += albedo * diffuse * lightColours[i];
		Fs += specular * vec3(1.0);
	}
	
	return Fd + Fs;
}

void getCamera(const vec2 uv, out vec3 ro, out vec3 rd)
{
	vec3 lookAt = vec3(0.0);
	ro = vec3(0.0, 0.0, 3.0);
	vec3 ww = normalize(lookAt - ro);
	vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
	vec3 vv = normalize(cross(uu, ww));
	rd = normalize(uv.x * uu + uv.y * vv + 1.5 * ww);
}

void main( void ) {
	vec2 uv = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
	uv.x *= resolution.x / resolution.y;
	vec3 colour = vec3(uv, 0.5);
	vec3 lookAt = vec3(0.0);
	vec3 ro, rd;
	getCamera(uv, ro, rd);
	
	vec3 pos;
	colour = render(ro, rd, pos);
	
	float vignette = 1.0 - smoothstep(0.1, 1.0, length(uv - vec2(0.0))) * 0.2;
	colour *= pow(vignette, 2.0);
	
	colour = pow(colour, vec3(1.0 / 2.2));

	gl_FragColor = vec4(colour, 1.0 );

}