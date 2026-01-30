#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float mandelbulb(vec3 p) {
	vec3 z = p;
	float dr = 1.0;
	float r = 0.0;
	float power = 8.0;
	for (int i = 0; i < 20; i++) {
		r = length(z);
		if (r > 2.0) break;
		
		float theta = acos(z.z / r);
		float phi = atan(z.y, z.x);
		dr = pow(r, power - 1.0) * power * dr + 1.0;
		
		float zr = pow(r, power);
		theta = theta * power;
		phi = phi * power;
		
		z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
		z += p;
	}
	return 0.5 * log(r) * r / dr;
}

void main( void ) {

	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y;
	
	vec3 ori = vec3(2.5 * cos(time), 0.0, 2.5 * sin(time));
	vec3 tar = vec3(0.0, 0.0, 0.0);
	vec3 camz = normalize(tar - ori);
	vec3 camy = vec3(0.0, 1.0, 0.0);
	vec3 camx = cross(camz,  camy);
	vec3 dir = normalize(camx * st.x + camy * st.y + camz * 1.0);
	
	float t = 0.0;
	int ite = 0;
	for (int i = 0; i < 256; i++) {
		ite = i;
		vec3 p = ori + t * dir;
		float d = mandelbulb(p);
		if (d < 0.00001 || t > 5.0) break;
		t += d;
	}
	
	float c = t <= 5.0 ? float(ite) / 256.0 : 1.0;
	gl_FragColor = vec4(vec3(c), 1.0);
}