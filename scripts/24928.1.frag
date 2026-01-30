precision mediump float; 
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
const float pi = 3.141592653589793;

float hash2(vec2 p) {
    return fract(sin(p.x * 15.73 + p.y * 35.29) * 43758.29);    
}

float shash2(vec2 p) {
    return hash2(p) * 2.0 - 1.0;
}

vec2 hash22(vec2 p) {
    return fract(sin(mat2(15.23, 35.76, 75.48, 153.69) * p) * 43758.29);
}

float noise2(vec2 p) {
    vec2 g = floor(p);
    vec2 f = fract(p);
    //f = f*f*(3.0 - 2.0*f);
    
    float lt = hash2(g + vec2(0.0, 1.0));
    float rt = hash2(g + vec2(1.0, 1.0));
    float lb = hash2(g + vec2(0.0, 0.0));
    float rb = hash2(g + vec2(1.0, 0.0));
    
    float t = mix(lt, rt, f.x);
    float b = mix(lb, rb, f.x);
    return mix(b, t, f.y);
}

float smin(float a, float b, float k) {
	float h = clamp((b - a) / k * 0.5 + 0.5, 0.0, 1.0);
	return mix(b, a, h) - k * h * ( 1.0 - h);
}

float voronoi(vec2 p) {
    vec2 g = floor(p);
    vec2 f = fract(p);
	//f = f*f*f*(6.0*f*f - 15.0*f + 10.0);
    
    float d = 1.0;
    for(int i = -1; i <= 1; i++) {
        for(int j = -1; j <= 1; j++) {
            vec2 b = vec2(i, j);
            d = min(d, length(hash22(g + b) + b - f));
        }
    }
    return d;
}

float pulse(float d, float w, float k) {
    return smoothstep(w + k, w, d) - smoothstep(-w, -w - k, d);
}

float sdPlane(vec3 p) {
    vec2 ms = mouse.xy * 2.0 - 1.0;
    ms.x *= resolution.x / resolution.y;
    ms.y *= -1.0;
    float d1 = sin(length(p.xz) * 3.141592 * 6.0 + time);
    float d2 = sin(length(p.xz - ms) * 3.141592 * 6.0);
    float k = clamp(d1 * d2 * 0.5 + 0.5, 0.0, 1.0);
    k = k*k*(3.0 - 2.0*k);
    k = pow(1.1, k);
	
    return p.y + k * 0.1;
}


float map(vec3 p) {
    float d = sdPlane(p);
 
    return d;
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(-1.0, 1.0) * 0.0001;
    return normalize(
        e.xyy * map(p + e.xyy) +
        e.yxy * map(p + e.yxy) +
        e.yyx * map(p + e.yyx) +
        e.xxx * map(p + e.xxx)
    );
}

float softshadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
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

void main() { 
    vec2 p = gl_FragCoord.xy / resolution;
    p = 2.0 * p - 1.0;
    p.x *= resolution.x / resolution.y;
    
    vec3 ro = vec3(0.0, 2.0, 3.0);
    vec3 ta = vec3(0.0, 0.0, 0.0);
    vec3 cw = normalize(ta - ro);
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 cu = normalize(cross(cw, up));
    vec3 cv = normalize(cross(cu, cw));
    vec3 rd = normalize(p.x * cu + p.y * cv + 3.0 * cw);
    
    float e = 0.0001;
    float t = 0.0;
    float h = e * 2.0;
    for(int i = 0; i < 60; i++) {
        if(h < e || t > 20.0) continue;
        h = map(ro + rd * t);
        t += h;
    }
    
    vec3 pos = ro + rd * t;
    vec3 nor = calcNormal(pos);
    vec3 lig = normalize(vec3(0.0, 0.5, 1.0));
    float dif = dot(nor, lig);
    float fre = dot(nor, rd) + 1.0;
    float fog = clamp(exp(-1.0 * (t - 18.0)), 0.0, 1.0);
    vec3 col = vec3(1.0, t / 20.0, 0.0) * dif + fre * 0.3;
    vec3 sun = vec3(1.0, 1.0, 0.0) * 0.3 / length(p.xy - vec2(0.0, 0.25));
    vec3 bg = vec3(0.1, 0.8 - (p.y * 0.5 + 0.5) * 0.7, 0.7) + sun;
    float sh = 0.2 + 0.8 * clamp(softshadow(pos, lig, 0.02, 20.0, 7.0), 0.0, 1.0);
	
    col = mix(bg, col, fog);
    col *= sh;
    col += fre * 0.2;
    if(t > 20.0) col = bg;
    gl_FragColor = vec4(col, 1.0);
}