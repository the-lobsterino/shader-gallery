#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec2 BOX_SIZE = vec2(0.03, 0.01);
const float LIGHT_DIST = 1.0;

float opU(float d1, float d2) {
	return min(d1, d2);
}

float circle(vec2 p, float r) {
	return length(p) - r;
}

mat2 rotation(float theta) {
	return mat2(cos(theta), -sin(theta), sin(theta), cos(theta));  
}

// Rotated box distance from https://www.shadertoy.com/view/4d2SzG
float boxDistance(vec2 pos, vec2 center, vec2 normal, vec2 scale) {
    mat2 rot = mat2(normal.x, -normal.y, normal.y, normal.x);
	vec2 delta = rot * (pos - center);
    delta = clamp(delta, -scale, scale);
    vec2 clampPos = center + delta * rot;
    return length(clampPos - pos);
}

float map(vec2 p) {
    float d = circle(p - vec2(-1.3, 0.7), 0.25);
    
    for(int i = 0; i < 26; i ++) {
	    for(int j = 0; j < 9; j ++) {
	    	d = opU(d, boxDistance(p, vec2(float(i) * 0.15 - 1.9, float(j) * 0.15 - 0.9), vec2(0.0, 1.0) * rotation(-(time + float(i * j)) * 2.0), BOX_SIZE));
	    }
    }
    
    return d;
}

vec3 shadow(vec2 ro, vec2 mo, vec3 color) {
	float distToLight = length(ro - mo);
	if(distToLight > LIGHT_DIST) return vec3(0.0);

	vec2 rd = normalize(mo - ro);
	for(int i = 0; i < 35; ++i) {
		float d = map(ro);
		float tmax = length(mo - ro);
		if(d > tmax) return (1.0 - distToLight / LIGHT_DIST) * color;
		if(d < 0.01) return vec3(0.0); 
		ro += d * rd;
	}
	
	return (1.0 - distToLight / LIGHT_DIST) * color;
}

void main() {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;
	vec2 mo = (mouse * resolution * 2.0 - resolution.xy) / resolution.y;
	
	vec3 bg = vec3(0.5) * (1.0 - length(uv) * 0.3);
	bg *= clamp(min(mod(gl_FragCoord.x, 20.0), mod(gl_FragCoord.y, 20.0)), 0.9, 1.0);
	//bg = mix(bg, vec3(1.0), plot_solid(circle(uv - vec2(mo), 0.01)));
	
	vec3 lighting;
	lighting += shadow(uv, mo, vec3(1.0, 0.0, 0.0));
	lighting += shadow(uv, vec2(mo.x + 0.1, mo.y), vec3(0.0, 1.0, 0.0));
	lighting += shadow(uv, vec2(mo.x + 0.2, mo.y), vec3(0.0, 0.0, 1.0));
	bg *= lighting;
    
	gl_FragColor = vec4(bg, 1.0);
}