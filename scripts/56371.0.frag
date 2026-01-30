#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 path(float t) {
	return vec3(cos(t * 0.1) * cos(t * 0.2) * 1., sin(t * 0.12) * sin(t * 0.3) * 1., t);
}

vec3 path2(float t) {
	return vec3(sin(t * 0.2) * sin(t * 0.4) * 2.5, cos(t * 0.3) * cos(t * 0.5) * 2.5, t);
}

float smin(float a, float b, float k)
{
    float h = clamp(0.5+0.5*(b-a)/k, 0.0, 1.0);
    return mix(b, a, h) - k*h*(1.0-h);
}

float smax(float a, float b, float k)
{
    return -smin(-a,-b, k);
}

float n3(vec3 p) {
    vec3 r = vec3(1,99,999);
    vec4 s = dot(floor(p), r) + vec4(0.0, r.yz, r.y + r.z);
    p = smoothstep(0., 1., fract(p));
    vec4 a = mix(fract(sin(s)*5555.), fract(sin(s+1.)*5555.), p.x);
    vec2 b = mix(a.xz, a.yw, p.y);
    return mix(b.x, b.y, p.z);
}

float fbm(vec3 p) {
	float ret;
	float s = 1.0;
	for(int i=0; i<3; i++) {
		ret += n3(p) * s;
		p *= 1.4;
		s *= 0.5;
	}
	return ret / 1.3;
}

float tunnel(vec3 p, float s) {
	float d = -(length(p.xy) - s);
	return d;
}

float map(vec3 p) {
	float d = tunnel(p - path(p.z), 1.0) * 0.7 - fbm(p * 5.) * 0.1;
	d = smax(d, tunnel(p - path2(p.z), .9) * 0.5 - fbm(p * 5.) * 0.1, 1.0);
	return d;
}

vec3 normal(vec3 p) {
	vec2 e = vec2(1.0, -1.0) * 0.0001;
	return normalize(
		e.xyy * map(p + e.xyy) +
		e.yxy * map(p + e.yxy) +
		e.yyx * map(p + e.yyx) +
		e.xxx * map(p + e.xxx)
	);
}

float shadow(vec3 p, vec3 ray, float ma) {
    float t = 0.01;
    float res = 1.0;
    for(int i = 0; i < 20; i++) {
        if (t > ma) break;
        vec3 pos = p + ray * t;
        float d = map(pos);
        if (d < 0.0001) return 0.0;
        t += d;
        res = min(res, 10.0 * d / t);
    }
    return res;
}

float luminance(vec3 col)
{
    return dot(vec3(0.3, 0.6, 0.1), col);
}

vec3 reinhard(vec3 col, float exposure, float white) {
    col *= exposure;
    white *= exposure;
    float lum = luminance(col);
    return (col * (lum / (white * white) + 1.0) / (lum + 1.0));
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;

	vec3 ro = path(time*2.);
	vec3 ta = path2(time*2. + 5.);
	vec3 fo = normalize(ta-ro);
	vec3 le = normalize(cross(vec3(0.,1.,0.), fo));
	vec3 up = normalize(cross(fo, le));
	vec3 ray = normalize(fo * (1.5 + (1.0 - dot(p, p)) * 0.0) + le * p.x + up * p.y);
	
	float t = 0.01;
	vec3 col = vec3(0.0);
	
	vec3 pos;
	for(int i=0; i<99; i++) {
		pos = ro + ray * t;
		float d = map(pos);
		if (d < 0.001) {
			//col = normal(pos);
			col = vec3(fbm(pos * 5.));
			break;
		}
		t += d;
	}
	col = vec3(fbm(pos * 5.));
	vec3 v = normalize(ta - pos);
	float dd = length(ta - pos);
	col *= vec3(dot(v, normal(pos))) / (dd * dd + 0.00001);
	col *= vec3(shadow(pos, v, dd));
	
	float ac = 0.0;
	float tt = 0.01;
	float stp = t / 30.;
	for(int i=0; i<30; i++) {
		vec3 pos = ro + ray * tt;
		float d = length(pos - ta) - 0.02;
		d = max(0.0001, d);
		float li = (0.4 * stp) / (d * d);
		tt += stp;
		ac += li * shadow(pos, v, dd);
	}
	col = vec3(col + ac);
	col = reinhard(col, 2., 8.);
	col = pow(col, vec3(1.0/2.2));
	//col = vec3(fbm(vec3(p*5., time*3.)));
	
	gl_FragColor = vec4( col, 1.0 );

}