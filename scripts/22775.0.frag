//WEEEEEEEEEEEEEEEE!!!!!!!!!! MIIIILLLE!!!!!!!
#ifdef GL_ES
precision mediump float;
#endif
#define SPHERE_POS vec3(0, -.2, 2)
#define PI 64.0
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float sphereDist(vec3 cp, vec3 sp, float radius) {
	return length(cp-sp)-radius;
}
vec2 dist(vec3 pos, vec3 dir) {
	float td = 0.;
	for(int i=0 ; i<50 ; i++) {
		float d = sphereDist(pos, SPHERE_POS, .5);
		td += d;
		pos += d*dir;
		if(d<.005) return vec2(td, 1.);
	}
	return vec2(0, 0.);	
}
void main(void) {
	vec2 p = gl_FragCoord.xy / resolution.xy*2.-1.;
	p *= .4;
	p.x *= resolution.x/resolution.y;
	vec3 pos = vec3(p.x, p.y+sin(p.x+time*4.)*.3, sin(time)+1.5);
	vec3 dir = normalize(vec3(p.x, p.y, 2.));
	float b = 1.;
	vec2 d = dist(pos, dir);
	vec3 col = vec3(0.);
	if(d.y>0.) {
		b = mod(d.x, .1)*5.0;
		d.x *= 64.;
		col = vec3(sin(d.x), sin(d.x+2.*PI/3.), sin(d.x-2.*PI/3.));
		col *= b;
	} else {
		float t = floor(time*PI*6. - tan(p.x*4.)*sin(time) + abs(p.y*4.)*tan(time))/12.;
		col = vec3(sin(t*PI*2.), sin(t*PI*2. + PI*2./3.), sin(t*PI*2. - PI*2./3.));
	}
	gl_FragColor = vec4(vec3(col), 1.0);

}