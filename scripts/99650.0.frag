#extension GL_OES_standard_derivatives : disable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.1415;

vec2 p = vec2(0.);

void drawCircle(vec2 position, float radius, inout float t){
	t += .005 / (abs(length(p + position) - radius));
}

void drawFlash(vec2 position, inout float t){
	t += .001 / (abs(p.x + position.x) * abs(p.y + position.y)) * (1. - abs(sin(time / 2.)));
}

void main(){
	p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
	vec3 destColor = vec3(p, .5);
	float t = 0.;
	
	for(int i_=0; i_<3; i_++){
		for(int i=0; i<5; i++){
			vec3 destColor = vec3(p, 0.5);
			float s = sin(time + (float(i) + float(i_) * sin(time)) * ((PI * 2.) / 5.));
			float c = cos(time + (float(i) + float(i_) * sin(time)) * ((PI * 2.) / 5.));
			
			drawCircle(vec2(c, s), .1, t);
			drawFlash(vec2(c, s), t);
		}
	}
	
	gl_FragColor = vec4(destColor * t, 1.);
}