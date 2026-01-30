#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct hit {
	vec3 pos;
	int objID; // -1: Background
};

vec3 rotateX(vec3 p, float phi) { float c = cos(phi); float s = sin(phi); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }
vec3 rotateY(vec3 p, float phi) { float c = cos(phi); float s = sin(phi); return vec3(c*p.x + s*p.z, p.y, c*p.z - s*p.x); }
vec3 rotateZ(vec3 p, float phi) { float c = cos(phi); float s = sin(phi); return vec3(c*p.x - s*p.y, s*p.x + c*p.y, p.z); }

float sphereDisplacement(vec3 p) {
	return length(smoothstep(0., 1., .5+sin(p*20.)*.5)*.5);
}

float sphere(vec3 p, vec3 pos, float r) {
	return length(p-pos)-r;
}

float map(vec3 p) {
	float d = sphere(p, vec3(sin(time*2.)*sin(time), sin(time*2.)*cos(time), 1.), .1);

	//p = rotateX(rotateZ(p, time*1.3), time);
	d = min(sphere(p, vec3(0.,0.,-.3), .5) - sphereDisplacement(p), d);
	
	return d;
}

vec3 normal(vec3 p) {
	vec2 e = vec2(1e-4, 0.);
	return normalize(vec3(
		map(p-e.xyy) - map(p+e.xyy),
		map(p-e.yxy) - map(p+e.yxy),
		map(p-e.yyx) - map(p+e.yyx)
	));
}

hit rayTrace(vec3 ro, vec3 rd) {
	float t = 0.;
	for (int i = 0; i < 256; i++) {
		vec3 p = ro + t*rd;
		float d = map(p);
		if (d < 1e-4) {
			return hit(p, 0);
		}
		t += d*.1;
	}
	return hit(vec3(0.), -1);
}

bool inShadow(vec3 p, vec3 n, vec3 lightPos) {
	return (rayTrace(p+2.*n, normalize(lightPos-p)).objID == -1);
}

vec3 doLighting(hit hi, vec3 ro) {
	vec3 lightPos = vec3(sin(time*2.)*sin(time), sin(time*2.)*cos(time), 1.);
	vec3 n = normal(hi.pos);

	vec3 ambientColor = vec3(.2, .3, .5);
	vec3 ambient = .3 * ambientColor;

	if (!inShadow(hi.pos, n, lightPos)) {
		vec3 diffuseColor = vec3(.3, .5, .8);
		vec3 diffuse = clamp(dot(hi.pos - lightPos, n), 0., 1.) * diffuseColor;
		
		vec3 specularColor = vec3(.8, .5, .3);
		float shininess = 30.;
		vec3 V = normalize(ro - hi.pos);
		vec3 L = normalize(-lightPos - hi.pos);
		vec3 specular = pow(max(0., dot(reflect(L, n), V)), shininess) * specularColor;
	
		return vec3(ambient + diffuse + specular);
	} else {
		return vec3(ambient);
	}
}

void main(void) {
	vec2 uv = (2.*gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);

	vec3 ro = vec3(uv, 1.);
	vec3 rd = normalize(vec3(uv, -1.));

	hit hi = rayTrace(ro, rd);
	
	vec3 color;
	if (hi.objID == -1) color = vec3(.2,.3,.5)*.3;
	else color = doLighting(hi, ro);
	
	gl_FragColor = vec4(vec3(color), 1.);
}