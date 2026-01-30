#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 crossPoint(vec3 p, vec3 a, vec3 b) {
	vec3 ap = p - a;
	vec3 bp = p - b;
	return cross(ap, bp);
}

vec3 crossPoint(vec2 p, vec2 a, vec2 b) {
	vec3 p3 = vec3(p, 0.0);
	vec3 a3 = vec3(a, 0.0);
	vec3 b3 = vec3(b, 0.0);
	return crossPoint(p3, a3, b3);
}

#define hex2rgb(r,g,b) (vec3(ivec3(r,g,b)) / vec3(256.0))
const vec3 colVoid = hex2rgb(0x1B, 0x28, 0x45);
const vec3 colAlt  = hex2rgb(0x95, 0xA3, 0xB3);
const vec3 colSun  = hex2rgb(0xF4, 0x9F, 0x0A);
const vec3 colA    = hex2rgb(0xA6, 0xC3, 0x6F);
const vec3 colB    = hex2rgb(0xED, 0x25, 0x4E);

void main( void ) {
	// Screen space
	float minres = min(resolution.x, resolution.y);
	vec2 pn = gl_FragCoord.xy / resolution;
	vec2 p = (pn * 2.0 - 1.0) * resolution / minres;
	
	// Get mouse coordinates
	vec2 mousep = (mouse * 2.0 - 1.0) * resolution / minres;;
	
	// Define a and b
	vec2 a = vec2(0.8, -0.8);
	vec2 b = mousep; // vec2(0.8, 0.8);
	
	vec3 cp = crossPoint(p, a, b);
	vec3 cm = crossPoint(vec2(0.0), a, b);
	bool cpParity = cp.z > 0.0;
	bool cmParity = cm.z > 0.0;
	float res = float(cpParity == cmParity);
	
	// Colouring
	vec3 col = colVoid;
	col = mix(col, colAlt, res);
	if (length(p) < 0.2) col = colSun;
	if (length(p-a) < 0.05) col = colA;
	if (length(p-b) < 0.05) col = colB;
	gl_FragColor = vec4(col, 1.0);
}