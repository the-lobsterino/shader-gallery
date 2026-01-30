#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
#define coloring color = vec3((1.0 + sin(FREQ * i + 3.0)) / 2.0,(1.0 + sin(FREQ * i + 5.0)) / 2.0,(1.0 + sin(FREQ * i + 7.0)) / 2.0);
#define FREQ 0.2

//coloring stolen from http://glslsandbox.com/e#421.0

uniform vec2 resolution;
uniform vec2 mouse;

vec2 cplxsqr(vec2 z) {
return vec2(z.x*z.x-z.y*z.y,2.*z.x*z.y);
}

void main(void) {
vec2 pos = vec2(mouse)*2.-1.;
pos.x *=resolution.x/resolution.y;
pos *= 1.5;
pos.x += 1.;
vec2 uv = (gl_FragCoord.xy / resolution.xy)*2.-1. ;
uv.x *=resolution.x/resolution.y;
uv *= 1.5;	
	
	
const float max_iter = 256.;
float i=0. ;
vec3 color ;
vec2 temp = uv;
	
if(uv.x<0. ){
	uv.x += 1.;
	temp = vec2(0.);
	for(float i = 0.;i<max_iter;i++){
		temp = cplxsqr(temp) + uv;
		if(temp.x*temp.x+temp.y*temp.y>4.) {
			coloring
		break;}
	}
}
else{
	temp.x-=1.5;
	for(float i = 0.;i<max_iter;i++){
			temp = cplxsqr(temp) + pos;
		if(temp.x*temp.x+temp.y*temp.y>4.) {
			coloring
		break;}
	}	
}
gl_FragColor = vec4(color, 1.);
}