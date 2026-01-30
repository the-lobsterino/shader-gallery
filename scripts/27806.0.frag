#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;



const int oct = 8;
const float per = 0.5;
const float PI = 3.1415926;
const float cCorners = 1.0/16.0;
const float cSides = 1.0/8.0;
const float cCenter = 11.0/4.0;


float interpolate(float a, float b, float x){
	float f = (1.0 - cos(x*PI))*0.5;
	return a * (1.0 - f) + b * f;
}


float rnd(vec2 p){
	return fract(sin(dot(p, vec2(12.9898, 78.233)))*43758.5453);
}


float irnd(vec2 p){
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec4 v = vec4(rnd(vec2(i.x, i.y)),
		     rnd(vec2(i.x+1.0, i.y)),
		     rnd(vec2(i.x, i.y+1.0)),
		     rnd(vec2(i.x+1.0, i.y+1.0)));
	return interpolate(interpolate(v.x, v.y, f.x), interpolate(v.z, v.w, f.x), f.y);
}


float noise(vec2 p){
	float t = 0.0;
	for(int i = 0; i < oct; i++){
		float freq = pow(2.0, float(i));
		float amp = pow(per, float(oct-i));
		t += irnd(vec2(p.x/freq, p.y/freq))*amp;
	}
	return t;
}


float circle(vec2 c, float r)
{
	vec2 p = gl_FragCoord.xy / min(resolution.x, resolution.y);
	
	float d = length(p - c);
	
	if (d < r) {
		float a2 = (1.0 - d / r);
		return a2;
	}
	
	return 0.0;
}

#define PI 3.14159265
#define PI2 (PI*2.0)

void main( void ) {
	vec2 t = gl_FragCoord.xy + vec2(time*10.0);
	vec2 texPos = vec2(gl_FragCoord.xy/resolution);
	vec2 texDelta = vec2(1.0/resolution);
	
	float n = 0.0;
	
	for (int j=-1; j<=1; j+=2) {
		for (int i=0; i<8; i++) {
			float x, y, fi = float(i);
			y = float(8-i) * 0.1 + sin(PI2/8.0*fi+time*12.0) * 0.125 * float(1+j);
			x = 0.75 + cos(PI2/8.0*fi+time*12.0) * 0.125 * float(j) + y*float(j)*0.1;
			vec2 p = vec2(x, y);
			n += noise(t*float(10-i)*0.5) * circle(p, 0.125+float(i)*0.02);
		}
	}
	
	gl_FragColor =
		vec4(vec3(n, n*0.25+n*0.25*fract(time), 0.0), 1.0);
}
	
	