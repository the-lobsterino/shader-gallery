#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere(vec3 ray, vec3 dir, vec3 center, float radius)
{
	vec3 rc = ray - center;
	float c = dot(rc, rc) - (radius * radius);
	float b = dot(dir, rc);
	float d = b * b - c;
	float t = -b - sqrt(abs(d));
	float st = step(0.0, min(t, d));
	return mix(-1.0, t, st);
}

vec3 background(float t, vec3 rd)
{
	vec3 light = normalize(vec3(sin(t), 0.6, cos(t)));
	float sun = max(0.0, dot(rd, light));
	float sky = max(0.0, dot(rd, vec3(0.0, 1.0, 0.0)));
	float ground = max(0.0, -dot(rd, vec3(0.0, 1.0, 0.0)));
	return (pow(sun, 256.0) + 0.2 * pow(sun, 2.0)) * vec3(2.0, 1.6, 1.0) +
		pow(ground, 0.5) * vec3(0.4, 0.3, 0.2) + pow(sky, 1.0) * vec3(0.5, 0.6, 0.7);
}

void main( void ) {

	vec2 screen = (-1.0 + 2.0 * gl_FragCoord.xy / resolution.xy) *
		vec2(resolution.x / resolution.y, 1.0);

	vec3 ro = vec3(sin(time), 1.0, -3.0);
	vec3 rd = normalize(vec3(screen, 1.0));
	vec3 pos = vec3(0.0, 0.0, 0.0);
	float t = sphere(ro, rd, pos, 1.0);
	vec3 normal = normalize(pos - (ro + rd * t));
	vec3 bgcol = background(time, rd);
	rd = reflect(rd, normal);
	vec3 col = background(time, rd) * vec3(0.9, 0.8, 1.0);	
	gl_FragColor = vec4(mix(bgcol, col, step(0.0, t)), 1.0);
}