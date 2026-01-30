#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
    vec3 pa = p - a;
    vec3 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - h * ba) - r;
}

vec3 tri(in vec3 x){return abs(fract(x)-.5);}
float surfFunc(in vec3 p){
	return dot(tri(p*0.5 + tri(p*0.25).yzx), vec3(0.666));
}

float smin(float a, float b, float k) {
    float h = clamp((b - a)/k *0.5 + 0.5, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float hash(vec2 p) {
    return fract(sin(p.x * 15.57 + p.y * 37.89) * 43758.26);
}

vec2 path(in float z){ 
    //return vec2(0);
    float a = sin(z * 0.11);
    float b = cos(z * 0.14);
    return vec2(a*4. - b*1.5, b*1.7 + a*1.5); 
}

float map(vec3 p) {
    vec3 q = p;
    p.xy -= path(p.z);
    float k = 1.57;
    //float g = dot(cos(p * k), sin(p.zyx * k)) + 1.2; // snake
    float g = dot(cos(p * k), sin(p.xzx * k)) + 1.2; // xzx
    float d = (g) + surfFunc(p * 10.0) * 0.1;
    return d = smin(q.y + surfFunc(q * 0.5) * 1.2 + 1.0, d, 0.5);
    //return d;
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(-1.0, 1.0) * 0.001;
    return normalize(
        e.xyy * map(p + e.xyy) +
        e.yxy * map(p + e.yxy) +
        e.yyx * map(p + e.yyx) +
        e.xxx * map(p + e.xxx)
	);
}

float trace(in vec3 ro, in vec3 rd){
	float FAR = 50.0;
    float t = 0.0, h;
    for(int i = 0; i < 72; i++){
        h = map(ro+rd*t);
        if(abs(h)<0.002*(t*.125 + 1.) || t>FAR) break; // Alternative: 0.001*max(t*.25, 1.)        
        t += step(h, 1.)*h*.2 + h*.5;
        
    }

    return min(t, FAR);
}

void main() {
	vec2 uv = (gl_FragCoord.xy - 0.5*resolution.xy) / resolution.y;

    //vec3 ro = vec3(sin(iGlobalTime) * 5.0, (cos(iGlobalTime * 0.5) * 0.5 + 0.5) * 5.0, 10.0);
    //vec3 ro = vec3(2.0, 1.0, 10.0 - iGlobalTime * 10.0);
    //vec3 ta = vec3(2.0 + sin(iGlobalTime)*1.0, 0.0, -iGlobalTime * 10.0);
    vec3 ta = vec3(0, 1, time*2. + 0.1);
	vec3 ro = ta + vec3(0.0, 0.0, -0.1);

    ro.xy += path(ro.z);
	ta.xy += path(ta.z);
    ro.y = 0.51;
    ta.y = 0.5;
	
    vec3 cw = normalize(ta - ro);
    vec3 cup = vec3(0.0, 1.0, 0.0);
    vec3 cu = normalize(cross(cw, cup));
    vec3 cv = normalize(cross(cu, cw));
    vec3 rd = normalize(vec3(uv.x * cu + uv.y * cv + 2.6 * cw));

    float e = 0.001;
    float h = 2.0 * e;
    float t = trace(ro, rd);
    
    float ff = clamp((t - 1.0) / 50.0, 0.0, 1.0);
    ff = exp(-5. * ff);
    vec3 sky = vec3(0., .9, 2.8);
    vec3 col = sky;
    if(t < 50.0) {
        vec3 pos = ro + rd * t;
        vec3 nor = calcNormal(pos);
        vec3 lig = normalize(pos);
        float dif = clamp(dot(nor, lig), 0.0, 1.0);
        vec3 ref = reflect(rd, nor);
        float spe = pow(clamp(dot(ref, lig), 0.0, 1.0), 64.0);
        //col = vec3(1.0) * (dif + spe);
        float fre = 1.0 - dot(nor, -rd);

        //col = (envd * 0.8 + 0.4* envs) * 0.8;
        col = vec3(1.0) * (dif + spe + fre * 0.5);
        //col = vec3(1.0) * fre;
        col = mix(sky, col, ff);
    }

	gl_FragColor = vec4(col, 1.0);
}