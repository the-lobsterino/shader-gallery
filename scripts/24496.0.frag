#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rotateX(vec3 p, float phi) { float c = cos(phi); float s = sin(phi); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }
vec3 rotateY(vec3 p, float phi) { float c = cos(phi); float s = sin(phi); return vec3(c*p.x + s*p.z, p.y, c*p.z - s*p.x); }
vec3 rotateZ(vec3 p, float phi) { float c = cos(phi); float s = sin(phi); return vec3(c*p.x - s*p.y, s*p.x + c*p.y, p.z); }

float sphereDisplacement(vec3 p, float r) {
	return length(smoothstep(0., 1., .5+sin(p*20.)*.5)*.5);
}

float sphere(vec3 p, float r) {
	return length(p-vec3(0.,0.,-.3))-r - sphereDisplacement(p, r);
}

float map(vec3 p) {
	p = rotateX(rotateZ(p, time*1.3), time);
	return sphere(p, .3);
}

vec3 normal(vec3 p) {
	vec2 e = vec2(1e-4, 0.);
	return normalize(vec3(
		map(p-e.xyy) - map(p+e.xyy),
		map(p-e.yxy) - map(p+e.yxy),
		map(p-e.yyx) - map(p+e.yyx)
	));
}

bool rayTrace(vec3 ro, vec3 rd, out vec3 p) {
	float t = -1.;
	for (int i = 0; i < 256; i++) {
		p = ro + t*rd;
		float d = map(p);
		if (d < 1e-4) return true;
		t += d*.1;
	}
	return false;
}

vec3 doLighting(vec3 p, vec3 ro) {
	vec3 lightPos = vec3(1.);
	vec3 n = normal(p);
	
	vec3 ambientColor = vec3(1.);
	vec3 ambient = .1 * ambientColor;
	
	vec3 diffuseColor = vec3(1.);
	vec3 diffuse = clamp(dot(p - lightPos, n), 0., 1.) * diffuseColor;
	
	// spec not working atm
	vec3 specularColor = vec3(1.);
	float shininess = 100.;
	vec3 V = normalize(ro - p);
	vec3 L = normalize(lightPos - p);
	vec3 specular = .5 * clamp(pow(normalize(dot(V+L,n)), shininess), 0., 1.) * specularColor;
	
	return vec3(ambient + diffuse);
}

void main(void) {
	vec2 uv = (2.*gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);

	vec3 ro = vec3(uv, 1.);
	vec3 rd = normalize(vec3(uv, cos(time/12.+length(uv))));
	
	vec3 p;
	bool hit = rayTrace(ro, rd, p);
	
	vec3 color;
	if (hit) color = doLighting(p, ro);
	else color = vec3(.2,.3,.5)*.3;
	
	gl_FragColor = vec4(vec3(color), 1.);
}