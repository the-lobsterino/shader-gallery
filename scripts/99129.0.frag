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


void main(void){
	highp vec2 size = vec2(resolution.x, resolution.y );
	vec2 uv = (4.0 * gl_FragCoord.xy - size) / size.x;
	vec2 p = (gl_FragCoord.xy * 2.1 - resolution) / min(resolution.x, resolution.y);
	
	//p = rotate2d((1. * (time * tan(3.14152697985354 / 3.141))) * PI) * p;
	uv = translate(p, vec2(0.0));
	uv *= revRotate2d(0.5*time);;
	p = translate(p, vec2(0.0));
	p *= rotate2d(1.2*time);
	float aaWidth = sqrt(15000.0)/size.y;
	float t = 0.4 / abs(abs(sin(1.)) - length(p));
	vec3 color = vec3(p.x + (sqrt(mouse.x * mouse.y / 1.0)), p.y + (sqrt(mouse.y * mouse.x / 11.0)),abs(sin((time / 9.1) * 1.0)) / (1.0 * .5) + 1.0) / 19.5;
	
	
	gl_FragColor = vec4(vec3(t) * color,1.0);
}