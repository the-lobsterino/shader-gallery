#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_STEPS 300
#define MAX_DIST 0.0001
#define OFFSET 0.001

float sd_sphere(vec3 p, vec3 pos, float radius) {
	return length(pos - p) - radius;
}

float sd_plane(vec3 p, float height) {
	return p.y - height;
}

float dist(vec3 p) {
	float sd = sd_sphere(p, vec3(0., 0., 1.), .5);
	float pd = sd_plane(p, -0.5);
	return min(sd, pd);
}

float raymarch(vec3 ro, vec3 rd) {
	float totalDist = 0.;
	for(int i=0; i<MAX_STEPS; i++) {
		vec3 curpos = ro + rd*totalDist;
		float d = dist(curpos);
		if(d < MAX_DIST) {
			return totalDist+d;
		}
		totalDist += d;
	}
	
	return 20.;
}

float blinn(vec3 p, vec3 n, vec3 rd) {
	vec3 light = vec3(-0., 2., 3.);
	vec3 v = normalize(p-light);
	
	float l = dot(n, v);
	
	/*
	rd = normalize(-rd);
	vec3 l = normalize(v);
	vec3 h = rd+l;
	h /= abs(rd+l);
	
	float i = 1.;
	float k = 16.;
	float s = 4.;
	
	return i*k*(dot(v+l, n)/(abs(v+l)*abs(
	*/
	return l;
}


vec3 color(vec3 ro, vec3 rd) {
	rd = normalize(rd);
	float d1 = raymarch(ro, rd);
	vec3 p1 = ro + (rd * d1);
	
	vec3 ro2 = vec3(ro.x+OFFSET, ro.y, ro.z);
	float d2 = raymarch(ro2, rd);
	vec3 p2 = ro2 + (rd * d2);
	
	vec3 ro3 = vec3(ro.x, ro.y+OFFSET, ro.z);
	float d3 = raymarch(ro3, rd);
	vec3 p3 = ro3 + (rd * d3);

	
	
	vec3 v1 = p1-p2;
	vec3 v2 = p1-p3;

	
	vec3 normal = normalize(-cross(v1, v2));
	
	return vec3(blinn(p1, normal, rd));
}


void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );

	uv -= 0.5;
	uv.x *= resolution.x / resolution.y;
	
	vec3 ro = vec3(uv, 0);
	vec3 rd = vec3(uv, 1);

	vec3 col = color(ro, rd);
	float flag = smoothstep(0.5, 0.5 - 0.05, length(uv));

	gl_FragColor = vec4( col, 1.0 ) * flag;

}