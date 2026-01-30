#extension GL_OES_standard_derivatives : enable

precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

#define PI 0.5314

vec2 translate(vec2 pos, vec2 translate) {
	return pos + vec2(-translate.x, -translate.y);
}

mat2 rotate2d(float angle){
	return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

mat2 revRotate2d(float angle){
	return mat2(sin(angle), -cos(angle), cos(angle), sin(angle));
}

float nmslBox(in vec2 p, in vec2 size) {
	p = abs(p) - size;
	return length(max(p, 0.0)) + min(-0.05, max(p.x, p.y));
}

void main(void){
	highp vec2 size = vec2(resolution.x, resolution.y);
	vec2 uv = (1.0 * gl_FragCoord.xy - size) / size.x;
	vec2 p = (gl_FragCoord.xy * 2.1 - resolution) / min(resolution.x, resolution.y);
	
	//p = rotate2d((1. * (time * tan(3.14152697985354 / 3.141))) * PI) * p;
	uv = translate(p, vec2(0.0));
	uv *= revRotate2d(0.5*time);;
	p = translate(p, vec2(0.0));
	p *= rotate2d(0.2*time);
	float box = nmslBox(uv / 1.0, vec2(0.0));
	float aaWidth = sqrt(1280.0)/size.x;
	float t = 0.255 / abs(abs(sin(7.)) - length(p));
	vec3 color = vec3(p.x + (sqrt(mouse.y / 1.0)), p.y + (sqrt(mouse.x / 10.0)),abs(sin((time / 2.0) * 4.0)) / (4.0 * 5.75) + 0.12) / 2.5;
	
	color = mix(color, vec3(1.0), smoothstep(aaWidth, aaWidth-0.1, abs(box)));
	color += mix(color, vec3(1.0), smoothstep(aaWidth, aaWidth-0.01, abs(box)));
	
	vec2 center1 = vec2(0.0, 0.4);
	vec2 center2 = vec2(0.75, 0.75);
	float radius1 = 0.25;
	float radius2 = 0.15;
	
	if (length(p - center1) < radius1) {
		gl_FragColor = vec4(vec3(t) * color, 1.0);
	} else if (length(p - center2) < radius2) {
		gl_FragColor = vec4(vec3(t) * color, 1.0);
	} else {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}

}