#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 hash(vec2 uv) {
	mat2 m = mat2(15.32, 35.68, 75.42, 153.93);
	return fract(sin(m * uv) * 43258.21);
}

vec3 hash(vec3 p) {
	mat3 m = mat3(15.32, 35.68, 75.42, 153.93, 18.23, 85.75, 254.63, 384.64, 712.98);
	return fract(sin(m * p) * 43258.21);
}

vec2 shash(vec2 uv) {
	return hash(uv) * 2.0 - 1.0;
}

vec3 shash(vec3 p) {
	return hash(p) * 2.0 - 1.0;
}

float noise(vec2 uv) {
	vec2 g = floor(uv);
	vec2 f = fract(uv);
	vec2 k = f*f*f*(6.0*f*f - 15.0*f + 10.0);
	float lb = dot(	shash(g + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));
	float rb = dot(	shash(g + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
	float lt = dot(	shash(g + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
	float rt = dot(	shash(g + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
	
	float b = mix(lb, rb, k.x);
	float t = mix(lt, rt, k.x);
	return 0.5 + 0.5 * mix(b, t, k.y);
}

float noise(vec3 p) {
	vec3 g = floor(p);
	vec3 f = fract(p);
	vec3 k = f*f*f*(6.0*f*f - 15.0*f + 10.0);
	float lbu = dot(shash(g + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0));
	float rbu = dot(shash(g + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0));
	float ltu = dot(shash(g + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0));
	float rtu = dot(shash(g + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0));
	float lbd = dot(shash(g + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0));
	float rbd = dot(shash(g + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0));
	float ltd = dot(shash(g + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0));
	float rtd = dot(shash(g + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0));
	
	float bu = mix(lbu, rbu, k.x);
	float tu = mix(ltu, rtu, k.x);
	float bd = mix(lbd, rbd, k.x);
	float td = mix(ltd, rtd, k.x);
	float u = mix(bu, tu, k.y);
	float d = mix(bd, td, k.y);
	return 0.5 + 0.5 * mix(u, d, k.z);
}

float fbm(vec2 uv) {
	float v = 0.0;
	mat2 m = mat2(0.8, -0.6, 0.6, 0.8);
	v += noise(uv) / 2.0; uv = m * uv * 2.01;
	v += noise(uv) / 4.0;  uv = m * uv * 2.03;
	v += noise(uv) / 8.0;  uv = m * uv * 2.02;
	v += noise(uv) / 16.0;
	return v * 1.3385;
}

float sdPlane(vec3 p) {
	return p.y + noise(p*100.0)*.001 + .5;
}

float plane(vec3 p) {
	return p.y + .5;
}

float sdSphere(vec3 p, float r) {
	return length(p) - r + noise(p * 100.0) * 0.01;
}

float sphere(vec3 p, float r) {
	return length(p) - r;
}

float cube(vec3 p, vec3 pos, vec3 size) {
	size /= 2.0;
	return max(max(abs(p.x+pos.x) - size.x, abs(p.y+pos.y) - size.y), abs(p.z+pos.z) - size.z);
}

float scene(vec3 p) {
	float d = plane(p);
	d = min(d, cube(p, vec3(1, - 1.0 - abs(sin(time)), 3), vec3(1, 3, 1)));
	d = min(d, cube(p, vec3(2, 0, 3), vec3(1, 5, 1)));
	d = min(d, cube(p, vec3(3, 0, 1), vec3(1, 5, 5)));
	d = min(d, cube(p, vec3(-1, 0, -1), vec3(1, 1, 5)));
	d = min(d, cube(p, vec3(-3, 0, 3), vec3(7, 5, 1)));
	d = min(d, cube(p, vec3(-3, 0, 1), vec3(3, 1, 1)));
	
	return d + noise(p*100.0)*.001;
}

vec3 calcNormal(vec3 p) {
	vec3 e = vec3(0.01, 0.0, 0.0);
	vec3 nor = vec3(scene(p + e.xyy) - scene(p - e.xyy),
			scene(p + e.yxy) - scene(p - e.yxy),
			scene(p + e.yyx) - scene(p - e.yyx));
	return normalize(nor);
}
/*
float calcAO(vec3 pos, vec3 nor )
{
	float totao = 0.0;
    float sca = 1.0;
    for( int aoi=0; aoi<5; aoi++ )
    {
        float hr = 0.01 + 0.05*float(aoi);
        vec3 aopos =  nor * hr + pos;
        float dd = scene( aopos );
        totao += -(dd-hr)*sca;
        sca *= 0.75;
    }
    return clamp( 1.0 - 4.0*totao, 0.0, 1.0 );
}
*/

float calcAO(vec3 ro, vec3 rd) {
	float t = 0.0;
	float h = 0.0;
	float sh = 1.0;
	for(int i = 0; i < 10; i++) {
		t += 0.01 + 0.05 * float(i);
        	h = scene(ro + rd * t);
		sh = min(sh, h * 6.0 / t);
	}
	return clamp(sh, -1.0, 1.0) * 0.05 + 0.95;
}
float shadow(vec3 ro, vec3 rd, float mint, float maxt) {
	float t = mint;
	float h = 0.0;
	float sh = 1.0;
	for(int i = 0; i < 30; i++) {
		if(t > maxt) continue;
		h = scene(ro + rd * t);
		sh = min(sh, h * 6.0 / t);
		//sh = h < 0.1 ? 0.0 : 1.0;
		t += h;
	}
	return sh;
}

float castRay(vec3 ro, vec3 rd, float maxt) {
	float precis = 0.00001;
	float t = precis * 2.0;
	for(int i = 0; i < 60; i++) {
		if(t < precis || t > maxt) continue;
		float h = scene(ro + rd * t);
		t += h;
	}
	return t;
}

vec3 render(vec3 ro, vec3 rd) {
	vec3 color = vec3(1.0);
	float t = castRay(ro, rd, 20.0);
	vec3 p = ro + rd * t;
	color = vec3(0.6) + 0.4*sin( vec3(0.05,0.08,0.10)*(p.x * 10.0 -1.0) );
	vec3 lig = normalize(vec3(-0.2, 0.5, 0.3));
	vec3 nor = calcNormal(p);
	float dif = clamp(dot(nor, lig), 0.0, 1.0);
	float spec = pow(clamp(dot(reflect(rd, nor), lig), 0.0, 1.0), 16.0);
	float sh = shadow(p, lig, 0.02, 20.0);
	float ao = calcAO(p, nor);
	color = color * (dif * ao + spec) * (0.2 + 0.8 * sh);
	color *= exp(-0.01 * t * t);
	return color;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv = uv * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	
	vec3 ro = vec3(0.0, 1.0, 3.0);
	vec3 ta = vec3(0.0, 0.0, 0.0);
	vec3 cw = normalize(ta - ro);
	vec3 up = vec3(0.0, 1.0, 0.0);
	vec3 cu = cross(cw, up);
	vec3 cv = cross(cu, cw);
	vec3 rd = normalize(uv.x * cu + uv.y * cv + 2.0 * cw);
	
	float angle = mouse.x*2.0-1.0;
	float newX = rd.x*cos(angle) + rd.z*sin(angle);
	float newZ = rd.z*cos(angle) - rd.x*sin(angle);
	rd.x = newX;
	rd.z = newZ;
	
	vec3 color = render(ro, rd);

	gl_FragColor = vec4( color, 1.0 );

}