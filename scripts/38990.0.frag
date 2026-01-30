#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float iSphere(vec3 ro, vec3 rd) {
	// sphere equation: |xyz| = r (...) => xyz = ro + t * rd => |ro|^2 + t^2 + 2<ro, rd>t = 0
	float r = 1.0; //radius
	float b = 2.0 * dot(ro, rd);
	float c = dot(ro, ro) - r*r;
	float h = b * b - 4.0 * c;
	if (h < 0.0) return -1.0;
	float t = (-b - sqrt(h))/2.0;
	return t;
}

float intersect(vec3 ro, vec3 rd) {
	float t = iSphere(ro, rd); //intersect sphere
	return t;
} 

void main(void)
{

	//pixel coordinates, from 0 to 1
	vec2 uv = gl_FragCoord.xy / resolution.xy;  
	
	//ray origin; ray distance
	vec3 ro = vec3(0.0, 1.0, 2.0);
	vec3 rd = normalize(vec3(-1.0+2.0*uv*vec2(1.50, 1.0), -1.0));

	float id = intersect(ro, rd);
	
	vec3 col = vec3(0.0);
	if (id > 0.0) {
		//intersected 3d object => draw white
		col = vec3(1.0);
	}
	
	gl_FragColor = vec4(col, 1.0);
	


}
