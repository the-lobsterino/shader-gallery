#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 lightdir = normalize(vec3(1.0, 2.0, 3.0));

float plane(in vec3 p) {
	return p.y;
}

float sphere(in vec3 p, in float r) {
	return length(p) - r;
}

vec4 scene(in vec3 p) {
	vec4 sd = vec4(vec3(0.2, 0.3, 0.5), sphere(p, 1.));
	float v = mod(floor(p.x) + floor(p.z), 2.);
	vec4 pd = vec4(v * vec3(0.2) + (1. - v) * vec3(0.5), plane(p - vec3(0, -1., 0)));
	return sd.w < pd.w ? sd : pd;
}

vec3 normal(in vec3 p) {
	float d = 0.0001;
	return normalize(vec3(
		scene(p + vec3(d, 0, 0)).w - scene(p + vec3(-d, 0, 0)).w,
		scene(p + vec3(0, d, 0)).w - scene(p + vec3(0, -d, 0)).w,
		scene(p + vec3(0, 0, d)).w - scene(p + vec3(0, 0, -d)).w
	));
}

vec3 render(in vec3 origin, in vec3 ray) {
	vec3 col = vec3(0.5) + ray.y * vec3(0.2);
	
	float tmin = 1.;
	float tmax = 20.;
	
	float d = 100.;
	vec3 mcol = vec3(0.);
	float t = 1.;
	for (int i = 0; i < 64; i++) {
		vec4 res = scene(origin + t * ray);
		d = res.w;
		if (d < 0.0001 || t > tmax) break;
		mcol = res.rgb;
		t += d;
	}
	
	
	if(t < tmax) {
		col = mcol;	
		vec3 nor = normal(origin + t * ray);
		float dif = clamp(dot(nor, lightdir), 0., 1.);
		col += dif * vec3(0.2, 0.2, 0.2);
		vec3 ref = reflect(ray, nor);
		float spe = clamp(dot(ref, lightdir), 0., 1.);
		col += pow(spe, 3.0) * vec3(0.3, 0.3, 0.3);
	}
	
	return col;
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2. - resolution) / resolution;
	p.x *= resolution.x / resolution.y;
	
	vec3 origin = vec3(mouse.x * 10. - 5., mouse.y * 10., 10.);
	vec3 target = vec3(0, 0, 0);
	
	vec3 front = normalize(target - origin);
	vec3 right = normalize(cross(vec3(0, 1., 0), front));
	vec3 up = normalize(cross(front, right));

	vec3 ray = mat3(right, up, front) * normalize(vec3(p.xy, 2.0));
	
	vec3 color = render(origin, ray);
	
	gl_FragColor = vec4(color, 1.);
}