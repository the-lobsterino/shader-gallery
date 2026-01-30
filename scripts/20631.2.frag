#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float sdHexPrism(vec3 p, vec2 h) {
	vec3 q = abs(p);
	return max(q.z - h.y, max(q.x + q.y*0.57735, q.y*1.1547)-h.x);
}
float sdBox(vec3 p, vec3 b) {
	vec3 d = abs(p) - b;
	return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}
float sdPlane(vec3 p) {
	return p.y;
}
float map(vec3 p) {
	float d = sdPlane(p);
	d = min(d, sdBox(p + vec3(0.0, -0.4 + 0.1*cos(time), 0.0), vec3(0.2, 0.2, 0.2)));
	d = min(d, sdHexPrism(p + vec3(0.6, -0.5 + 0.1*sin(time), -1.3), vec2(0.4, 0.9)));
	return d;
}
float softshadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
	float sh = 1.0;
	float h = 0.0;
	float t = mint;
	for(int i=0; i<30; i++) {
		if(t > maxt)
			continue;
		h = map(ro + rd*t);
		t += h;
		sh = min(sh, k*h/t);
	}
	return sh;
}
vec3 calcNormal(vec3 p) {
	vec3 e = vec3(0.001, 0.0, 0.0);
	vec3 nor = vec3(
		map(p + e.xyy) - map(p - e.xyy),
		map(p + e.yxy) - map(p - e.yxy),
		map(p + e.yyx) - map(p - e.yyx));
	return normalize(nor);
}
float rayCast(vec3 ro, vec3 rd, float maxt) {
	float precis = 0.001;
	float h = precis*2.0;
	float t = 0.0;
	for(int i=0; i<60; i++) {
		if(abs(h) < precis || t > maxt)
			continue;
		h = map(ro + rd*t);
		t += h;
	}
	return t;
}
vec3 render(vec3 ro, vec3 rd) {
	vec3 col = vec3(1.0);
	float t = rayCast(ro, rd, 20.0);
	vec3 pos = ro + rd*t;
	vec3 nor = calcNormal(pos);
	vec3 lig = normalize(vec3(0.4, 0.7, 5.0));
	float dif = clamp(dot(nor, lig), 0.0, 1.0);
	float spec = pow(clamp(dot(reflect(rd, nor), lig),0.0, 1.0), 16.0);
	float sh = softshadow(pos, lig, 0.02, 20.0, 7.0);
	col = col*(dif+spec)*sh;
	return col;
}
void main( void ) {
	vec2 p = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.y;
	vec3 ro = vec3(-0.5 + cos(time), 0.7 + 0.7 + 0.2*cos(time), -3.0);
	vec3 ta = vec3(0.0);
	vec3 cw = normalize(ta - ro);
	vec3 cp = vec3(0.0, 1.0, 0.0);
	vec3 cu = normalize(cross(cw, cp));
	vec3 cv = normalize(cross(cu, cw));
	vec3 rd = normalize(p.x*cu + p.y*cv + 2.5*cw);
	vec3 col = render(ro, rd);
	gl_FragColor = vec4(col, 1.0);
}