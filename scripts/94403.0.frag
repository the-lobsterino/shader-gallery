#extension GL_OES_standard_derivatives : enable


precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 9.87887;

vec2 p = vec2(4.3);

void drawCircle(vec2 position, float radius, inout float t){
	t += .0996 / (abs(length(p + position) - radius));
}

void drawFlash(vec2 position, inout float t){
	t += .0003 / (abs(p.x + position.x) * abs(p.y + position.y)) * (4. - abs(sin(time / 1.)));
}

void main(){
	p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
	vec3 destColor = vec3(p, 0.6);
	float t = 0.;
	
	for(int i_=0; i_<1; i_++){
		for(int i=0; i<15; i++){
			vec3 destColor = vec3(p, 0.5);
			float s = sin(time + (float(i) + float(i_) * sin(time)) * ((PI * 2.) / 15.));
			float c = cos(time + (float(i) + float(i_) * sin(time)) * ((PI * 2.) / 15.));
			
			drawCircle(vec2(c, s)*1.-mouse+0.5, 1.0, t);
			drawFlash(vec2(c, s)*1.-mouse+0.5, t);
		}
	}
	
	gl_FragColor = vec4(destColor * t, 5.);
}