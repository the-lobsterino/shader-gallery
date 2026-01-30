/* Iridule */
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate(float a) {
	float c = cos(a);
	float s = sin(a);
	return mat2(c, -s, s, c);
}

float disp(vec3 p) {
	float f = 16.;
	float t = time;
	return .08 * cos(p.x * f + t) * cos(p.z * f + t) * cos(p.y * f + t);
}

float map(vec3 p) {
	float d = 0.;
	float k = disp(p);
	d = length(p) - .5;
	return d + k;
}

vec3 normal(vec3 p) {
	vec3 n, E = vec3(.005, 0., 0.);
	n.x = map(p + E.xyy) - map(p - E.xyy);
	n.y = map(p + E.yxy) - map(p - E.yxy);
	n.z = map(p + E.yyx) - map(p - E.yyx);
	return normalize(n);
}

void main() {
	vec3 kA = vec3(.1, 0., .1);
	vec3 kD = vec3(.8, .2, 0.);
	vec3 kS = vec3(.8, .9, .1);
	float T = time;
	vec2 uv = (gl_FragCoord.xy - .5 * resolution) / resolution.y;
	/*ray origin*/ vec3 ro = vec3(0., 0., -3.); 
	/*ray direction*/vec3 rd = vec3(uv, 1.);
	float t = 0.;
	for (int i = 0; i < 32; i++) {
		vec3 p = ro + rd * t;
		t += .8 * map(p);
	}
	vec3 p = ro + rd * t;
	vec3 n = normal(p);
	vec3 lp = normalize(vec3(cos(T), 1., sin(T)) - p);
	float diff = .5 * clamp(dot(lp, n), 0., 1.);
	float spec = .02 * pow(max(dot(reflect(-lp, n), ro), 0.), 3.);
	
	if (t < 3.) // my raymarch function must be messed?
		//gl_FragColor = vec4(1. / t * t * .01 + .05  + diff + spec);
		//gl_FragColor = vec4(.05 * diff + spec, 1.);
		gl_FragColor = vec4(kA + kD * diff + kS * spec, 1.);
	else
		gl_FragColor = vec4(0.);
}