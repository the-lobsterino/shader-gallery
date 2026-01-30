#extension GL_OES_standard_derivatives : enable


precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.1415;

vec2 p = vec2(0.0);

void drawCircle(vec2 position, float radius, inout float t){
	t += 0.005 / (abs(length(p + position) - radius));
}

void drawFlash(vec2 position, inout float t){
	t += 0.001 / (abs(p.x + position.x) * abs(p.y + position.y)) * (1. - abs(sin(time / 2.))) + 0.1;
}

void main(){
	vec2 r2 = vec2(resolution.x);
	p = (gl_FragCoord.xy / r2.xy);
	vec3 destColor = vec3(sin(time) + p.x, cos(time + 1.0) + p.y, 1.0);
	float t = 0.0;
	
	p.x += time / 10.0;
	p.y += cos(time) / 30.0;
	
	p = p * 5.0;
	p = fract(p);
	
	p.x -= 0.5;
	p.y -= 0.5;
			
	drawCircle(vec2(0, 0), 0.25, t);
	drawFlash(vec2(0, 0), t);
	
	gl_FragColor = vec4(destColor * t, 1.0);
}