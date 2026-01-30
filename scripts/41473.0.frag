#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926536
#define PIXEL 6.0

float noise(vec2 p){
	//return (mod(p.x,2.0)+mod(p.y,2.0))*10.0+60.0;
	return fract(cos(p.x*25819.256 + p.y*16987.236)*98431.687 + sin(p.x*98424.169+p.y*68765.698)*26543.968)*10.0+65.0;
}

float interpolate(float a, float b, float x){
	return a*(1.0-x) + b*x;
}
float noise_smooth(vec2 p, float d){
	vec2 off = vec2(0.0, 1.0);
	vec2 pp = p/d;
	float p00 = noise(floor(pp)+off.xx);
	float p01 = noise(floor(pp)+off.xy);
	float p10 = noise(floor(pp)+off.yx);
	float p11 = noise(floor(pp)+off.yy);
	vec2 i = 1.0 - vec2(cos(fract(pp.x)*PI), cos(fract(pp.y)*PI))*0.5-0.5;
	float p0 = interpolate(p00, p01, i.y);
	float p1 = interpolate(p10, p11, i.y);
	return interpolate(p0, p1, i.x);
}

void main( void ) {

	vec2 position = gl_FragCoord.xy - resolution.xy/2.0 + mouse*resolution*70.0;
	position = floor(position/PIXEL);
	float h = 0.0;
	h += noise_smooth(position, 10.0);
	h += noise_smooth(position, 20.0);
	h += noise_smooth(position, 40.0);
	h += noise_smooth(position, 80.0);
	h += noise_smooth(position, 160.0);
	h += noise_smooth(position, 320.0);
	h += noise_smooth(position, 640.0);
	h /= 7.0;
	gl_FragColor = vec4( vec3(h/12.8-5.0) , 1.0 );

}