#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 resolution;

float hash11(float p) {
	return fract(sin(p)*45768.23);
}

float hash21(vec2 p) {
	return fract(sin(p.x * 15.23 + p.y * 32.12) * 45768.23);
}

float hash31(vec3 p) {
	return fract(sin(p.x *15.23 + p.y * 35.87 + p.z * 75.53) * 45768.23);
}

vec2 hash22(vec2 p) {
	mat2 m = mat2(15.23, 32.12, 71.23, 152.31);
	return fract(sin(m*p)*45768.23);
}

vec3 hash33(vec3 p) {
	mat3 m = mat3(15.23, 35.11, 70.24, 151.22, 301.11 , 612.23, 1345.17, 2678.98, 5371.13);
	return fract(sin(m*p)*45768.23);
}

float value_noise(vec3 p) {
	vec3 g = floor(p);
	vec3 f = fract(p);
	float fbl = hash31(g + vec3(0.0, 0.0, 0.0));
	float fbr = hash31(g + vec3(1.0, 0.0, 0.0));
	float ftl = hash31(g + vec3(0.0, 1.0, 0.0));
	float ftr = hash31(g + vec3(1.0, 1.0, 0.0));
	float bbl = hash31(g + vec3(0.0, 0.0, 1.0));
	float bbr = hash31(g + vec3(1.0, 0.0, 1.0));
	float btl = hash31(g + vec3(0.0, 1.0, 1.0));
	float btr = hash31(g + vec3(1.0, 1.0, 1.0));
	
	float fb = mix(fbl, fbr, f.x);
	float ft = mix(ftl, ftr, f.x);
	float fres = mix(fb, ft, f.y);
	float bb = mix(bbl, bbr, f.x);
	float bt = mix(btl, btr, f.x);
	float bres = mix(bb, bt, f.y);
	
	float res = mix(fres, bres, f.z);
	return res;
}

float fbm(vec3 p) {
	float r = 0.0;
	r += value_noise(p);
	r += value_noise(p * 2.0) / 4.0;
	r += value_noise(p * 4.0) / 8.0;
	r += value_noise(p * 8.0) / 16.0;
	return r;
}

float sdPlane(in vec3 p) {
    return p.y;// + 0.1*fbm(p*10.0);
}

float sdSphere(in vec3 p, in float r) {
    return length(p) - r;//- 0.17*fbm(p*5.0);
}

float udRoundBox( vec3 p, vec3 b, float r )
{
  return length(max(abs(p)-b,0.0))-r - 0.17*fbm(p*6.0);
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}

float map(in vec3 p) {
    float d = sdPlane(p);
    d = min(d, sdSphere(p - vec3(0.0, 0.25, 0.0), 0.25));
	//d  = min(d, sdBox(p, vec3(0.5, 0.15, 0.05)));
	d  = min(d, udRoundBox(p, vec3(0.55, 0.18, 0.06), 0.05));
    return d;
}

vec3 calcNormal(in vec3 p) {
    vec3 e = vec3(0.001, 0.0, 0.0);
    vec3 nor = vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
    );
    return normalize(nor);
}

float castRay(in vec3 ro, in vec3 rd, in float maxt) {
    float precis = 0.001;
    float h = precis * 2.0;
    float t = 0.0;
    for(int i = 0; i < 60; i++) {
        if(abs(h) < precis || t > maxt) continue;
        h = map(ro + rd * t);
        t += h;
    }
    return t;
}

float softshadow(in vec3 ro, in vec3 rd, in float mint, in float maxt, in float k) {
    float sh = 1.0;
    float t = mint;
    float h = 0.0;
    for(int i = 0; i < 30; i++) {
        if(t > maxt) continue;
        h = map(ro + rd * t);
        sh = min(sh, k * h / t);
        t += h;
    }
    return sh;
}

vec3 render(in vec3 ro, in vec3 rd) {
    vec3 col = vec3(1.0);
    float t = castRay(ro, rd, 20.0);
    vec3 pos = ro + rd * t;
    vec3 nor = calcNormal(pos);
    vec3 lig = normalize(vec3(-0.4, 0.7, 0.5));
    float dif = clamp(dot(lig, nor), 0.0, 1.0);
    float spec = pow(clamp(dot(reflect(rd, nor), lig), 0.0, 1.0), 16.0);
    float sh = softshadow(pos, lig, 0.02, 20.0, 7.0);
    col = col * (dif + spec) * sh;
    return col;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= resolution.x / resolution.y;
    vec3 ro = vec3(0.0, 2.0, 3.0);
    vec3 ta = vec3(0.0, 0.0, 0.0);
    vec3 cw = normalize(ta - ro);
    vec3 cp = vec3(0.0, 1.0, 0.0);
    vec3 cu = normalize(cross(cw, cp));
    vec3 cv = normalize(cross(cu, cw));
    vec3 rd = normalize(p.x * cu + p.y * cv + 2.5 * cw);
    vec3 col = render(ro, rd);
    
    gl_FragColor = vec4(col, 1.0);
}