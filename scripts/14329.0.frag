precision mediump float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

vec2 hash(in vec2 uv) {
    return fract(sin(mat2(15.25, 38.42, 75.89, 156.62) * uv) * 43758.69);
}

vec3 hash(in vec3 p) {
    return fract(sin(mat3(
        15.25, 38.42, 86.12, 
        75.89, 156.62, 237.25,
        187.21, 316.28, 512.23
    ) * p) * 43758.69);
}

vec2 shash(in vec2 uv) {
    return hash(uv) * 2.0 - 1.0;
}

vec3 shash(in vec3 p) {
    return hash(p) * 2.0 - 1.0;
}

float voronoi(in vec3 p) {
    vec3 n = floor(p);
    vec3 f = fract(p);
    
    float res = 0.0;
    for(int k = -1; k <= 1; k++)
    for(int j = -1; j <= 1; j++)
    for(int i = -1; i <= 1; i++) {
        vec3 g = vec3(i, j, k);
        float d = length(g + hash(n + g) - f);
        res += exp(-64.0 * d);
    }
    res = (-1.0 / 64.0) * log(res);
    res = res*res*res*(6.0*res*res - 15.0*res + 10.0);
    res = smoothstep(0.0, 1.0, res);
    return res;
}

float noise(in vec2 uv) {
    vec2 n = floor(uv);
    vec2 f = fract(uv);
    vec2 k = f*f*f*(6.0*f*f - 15.0*f + 10.0);
    
    float bl = dot(shash(n + vec2(0.0, 0.0)), -f + vec2(0.0, 0.0));
    float br = dot(shash(n + vec2(1.0, 0.0)), -f + vec2(1.0, 0.0));
    float tl = dot(shash(n + vec2(0.0, 1.0)), -f + vec2(0.0, 1.0));
    float tr = dot(shash(n + vec2(1.0, 1.0)), -f + vec2(1.0, 1.0));

    return mix(mix(bl, br, k.x), mix(tl, tr, k.x), k.y) * 1.0;
}

float fbm(in vec2 uv) {
    vec2 p = uv;
    float res = 0.0;
    res += noise(uv); uv = uv * 2.02;
    res += (noise(uv) / 2.0); uv = uv * 2.03;
    res += (noise(uv) / 4.0); uv = uv * 2.01;
    res += (noise(uv) / 8.0); uv = uv * 2.04;
    res += (noise(uv) / 16.0);
    return abs(sin(length(p * 5.0) + res - time));
}

float sdPlane(in vec3 p) {
    return p.y;
}

float sdSphere(in vec3 p, in float r) {
    return length(p) - r + voronoi(p * 5.0) * 0.05;
}

float map(in vec3 p) {
    float d = sdPlane(p);
    d = min(d, sdSphere(p - vec3(0.0, 0.25, 0.0), 0.5));
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

// ao
const int   ao_iterations = 5;
const float ao_step = 0.2;
const float ao_scale = 1.46;

float calcAO( vec3 v, vec3 n ) {
	float sum = 0.0;
	float att = 1.0;
	float len = ao_step;
	for ( int i = 0; i < ao_iterations; i++ ) {
	    sum += ( len - map( v + n * len ) ) * att;
	    len += ao_step;
            att *= 0.5;
	}
	return max( 1.0 - sum * ao_scale, 0.0 );
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
    float sh = clamp(softshadow(pos, lig, 0.02, 20.0, 7.0), 0.2, 1.0);
    float ao = calcAO(pos, nor);
    col = col * (dif * 0.9 + spec + ao * 0.1) * sh;
    return col;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= resolution.x / resolution.y;
    float theta = mouse.x;
    float cx = 3.0 * cos(theta * 3.141592653589793 * 2.0);
    float cz = 3.0 * sin(theta * 3.141592653589793 * 2.0);
    vec3 ro = vec3(cx, 2.0 + mouse.y, cz);
    vec3 ta = vec3(0.0, 0.25, 0.0);
    vec3 cw = normalize(ta - ro);
    vec3 cp = vec3(0.0, 1.0, 0.0);
    vec3 cu = normalize(cross(cw, cp));
    vec3 cv = normalize(cross(cu, cw));
    vec3 rd = normalize(p.x * cu + p.y * cv + 4.5 * cw);
    vec3 col = render(ro, rd);
    
    gl_FragColor = vec4(col, 1.0);
}