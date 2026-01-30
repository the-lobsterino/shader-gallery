#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float smin( float a, float b, float k ) {
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}


float smin1( float a, float b, float k )
{
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}

float smin2( float a, float b, float k )
{
    a = pow( a, k ); b = pow( b, k );
    return pow( (a*b)/(a+b), 1.0/k );
}

float sdPlane(in vec3 p) {
	return p.y;
}

float sdSphere(in vec3 p, in float r) {
	return length(p) - r;
}

float map(in vec3 p) {
	float d = sdPlane(p);
	float k = 0.0;
	for(int i = 0; i < 10; i++) {
		float t = k / 10.0;
		float y = 0.25 * k * 0.5;
		float x = sin(y * 3.141592653589793 * 2.0 + time) * 0.1 * t;
		d = smin(d, sdSphere(p - vec3(x, 0.25 * k * 0.5, 0.0), 0.05 + 0.15 * (1.0 - t)), 0.03);
		k += 1.0;
	}
	return d;
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
	float h = 0.0;
	float t = mint;
	for(int i = 0; i < 60; i++) {
		if(t > maxt) continue;
		h = map(ro + rd * t);
		sh = min(sh, k * h / t);
		t += h;
	}
	return sh;
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

vec3 render(in vec3 ro, in vec3 rd) {
	vec3 col = vec3(1.0);
	float t = castRay(ro, rd, 20.0);
	vec3 pos = ro + rd * t;
	vec3 nor = calcNormal(pos);
	vec3 lig = normalize(vec3(-0.2, 0.7, 0.5));
	float dif = clamp(dot(nor, lig), 0.0, 1.0);
	float spec = pow(clamp(dot(reflect(rd, nor), lig), 0.0, 1.0), 16.0);
	float sh = softshadow(pos, lig, 0.02, 20.0, 7.0);
	col = col * (dif + spec) * sh;
	return col;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
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

	gl_FragColor = vec4( col, 1.0 );

}