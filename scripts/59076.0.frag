#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define NEAR 2.0
#define FAR 25.0
#define EPS 1e-3
#define EPS_N 1e-4
#define RAYSTEP 199
#define AOSTEP 3
#define PI 3.1415926535

// util
#define saturate(x) clamp(x, 0.0, 1.0)
#define calcNormal(p, dFunc) normalize(vec2(EPS_N, -EPS_N).xyy * dFunc(p + vec2(EPS_N, -EPS_N).xyy)+ vec2(EPS_N, -EPS_N).yyx * dFunc(p + vec2(EPS_N, -EPS_N).yyx ) + vec2(EPS_N, -EPS_N).yxy * dFunc(p + vec2(EPS_N, -EPS_N).yxy) + vec2(EPS_N, -EPS_N).xxx * dFunc(p + vec2(EPS_N, -EPS_N).xxx))

vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c,s,-s,c);
}

float sdPlane(vec3 p, float y){
	return p.y - y;
}

float sdBox(vec3 p, vec3 s){
	vec3 d = abs(p) - s;
	return max(max(d.x,d.y), d.z);
}

float sdSphere(vec3 p, float r){
	return length(p) - r;
}

float dBar(vec2 p, float width) {
    vec2 d = abs(p) - width;
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) + 0.01 * width;
}

float dCrossBar(vec3 p, float x) {
    float bar_x = dBar(p.yz, x);
    float bar_y = dBar(p.zx, x);
    float bar_z = dBar(p.xy, x);
    return min(bar_z, min(bar_x, bar_y));
}

float dMenger(vec3 p, float s){
    float d = sdBox(p, vec3(s));
	for(int i = 0; i < 5; i++){
	    d = max(d, -dCrossBar(mod(p + s / 2.0, s * 2.0) - s / 2.0, s / 3.0));
	    s /= 3.0;
	}
	return d;
}

float PolarCrossBar(vec3 p, float s){
	float d = FAR;
	for(int i = 0; i < 4; i++){
	    p = abs(p);
	    p.xy *= rot(time*0.1);
	    p.xz *= rot(time*0.07);
	    p.yz *= rot(time*0.05);
	    d = min(d, dCrossBar(mod(p, 0.5) - 0.25, s));
	    s *= 0.8;
	}
	return d;
}

float map(vec3 p){
	float d = FAR;
	
	d = min(d, sdPlane(p, -0.6));
	d = min(d, sdSphere(p, 1.0));
	d = min(d, sdBox(p - vec3(2.0, 0.0, 0.0), vec3(0.6)));
	d = min(d, sdBox(p - vec3(-2.0, 0.0, 0.0), vec3(0.6)));
	d = min(d, dMenger(p - vec3(0.0, -0.6, 0.0), 16.0));
	//d = max(d, -PolarCrossBar(p, 0.125));

	return d;
}

float calcAO(vec3 p, vec3 n, float d, float k){
	float occ = 0.0;
	for(int i = 0; i < AOSTEP; i++){
		float len = float(i+1) / float(AOSTEP) * d;//0.15 + float(i) * 0.15;
		float distance = map(n * len + p);
		occ += (len - distance) * k;
		k *= 0.5;
	}
	return saturate(1.0 - occ);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	vec3 col = vec3(0.0);
	vec3 cameraPos = vec3(0.0, 1.0, -5.0 + sin(time*0.5)*1.5);
	cameraPos.xz *= rot(time*0.5);
	float sceneZ = 2.5;
	vec3 rayDirection = normalize(vec3(uv.x, uv.y + sin(time * 0.2) * 0.5, sceneZ));
	rayDirection.xz *= rot(time*0.5);
	vec3 light = normalize(vec3(-1.0, 1.0, -1.0)) * 1.0;
	vec3 rayPos = cameraPos;
	float depth = 0.0;
	for(int i = 0; i < RAYSTEP; i++){
		rayPos = cameraPos + rayDirection * depth;
		float dist = map(rayPos);
		if(dist < EPS){
			// color
			float dAmount = smoothstep(FAR, NEAR, depth);
			col = vec3(dAmount) * hsv(depth*0.3-time*0.0, 0.8, 2.0);
			// normal
			vec3 normal = calcNormal(rayPos, map);
		    // Ambient Occlusion
			float ao = calcAO(rayPos, normal, 0.7, 2.0);
			col *= ao;
			// disffuse
			float diff = max(dot(normal, light) * 1.5, 0.5);
			col *= diff;
			break;
		}
		depth += dist;
	}
	//col = pow(col, vec3(2.0));
	gl_FragColor = vec4( col, 1.0 );
}