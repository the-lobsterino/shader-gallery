precision highp float;
uniform vec2 resolution;

float sdPlane(in vec3 p) {
    return p.y;
}

float sdSphere(in vec3 p, in float r) {
    return length(p) - r;
}

/*
   Different distance estimations from:http://blog.hvidtfeldts.net/index.php/2011/09/distance-estimated-3d-fractals-v-the-mandelbulb-different-de-approximations/

 * z = r*(sin(theta)cos(phi) + i cos(theta) + j sin(theta)sin(phi)
 * zn+1 = zn^8 +c
 * z^8 = r^8 * (sin(8*theta)*cos(8*phi) + i cos(8*theta) + j sin(8*theta)*sin(8*theta)
 * zn+1' = 8 * zn^7 * zn' + 1
*/

vec3 mb(vec3 p) {
	p.xyz = p.xzy;
	vec3 z = p;
	vec3 dz=vec3(0.0);
	float power = 8.0;
	float r, theta, phi;
	float dr = 1.0;
	
	float t0 = 1.0;
	
	for(int i = 0; i < 7; ++i) {
		r = length(z);
		if(r > 2.0) continue;
		theta = atan(z.y / z.x);
		phi = asin(z.z / r);
		
		dr = pow(r, power - 1.0) * dr * power + 1.0;
	
		r = pow(r, power);
		theta = theta * power;
		phi = phi * power;
		
		z = r * vec3(cos(theta)*cos(phi), sin(theta)*cos(phi), sin(phi)) + p;
		
		t0 = min(t0, r);
	}
	return vec3(0.5 * log(r) * r / dr, t0, 0.0);
}

float map(in vec3 p) {
    float d = sdPlane(p);
    //d = min(d, sdSphere(p - vec3(0.0, 0.25, 0.0), 0.25));
    d = min(d, mb(p).x);
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