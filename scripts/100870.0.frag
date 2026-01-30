#ifdef GL_ES
precision mediump float;
#endif
///
#extension GL_OES_standard_derivatives : enable
//
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float	PI	= 3.1415926;
const int	oct	= 1;
const float	per	= 0.95;
const float	map	= 4.0;	
const float nmul = 15.0;
const float rmul = 0.4;

vec3 HSVtoRGB(vec3 HSV){
	vec3 RGB = vec3(HSV.z, HSV.z, HSV.z);
	float h = HSV.x * 6.0;
	int i = int(h); 
	float f = h - float(i);
	
	if(i == 0) {
		RGB.y *= 1.0 - HSV.y * (1.0 - f);
		RGB.z *= 1.0 - HSV.y;
	} else if (i == 1) {
		RGB.x *= 1.0 - HSV.y * f;
		RGB.z *= 1.0 - HSV.y;
	} else if (i == 2) {
		RGB.z *= 1.0 - HSV.y * (1.0 - f);
		RGB.x *= 1.0 - HSV.y;
	} else if (i == 3) {
		RGB.y *= 1.0 - HSV.y * f;
		RGB.x *= 1.0 - HSV.y;
	} else if (i == 4) {
		RGB.x *= 1.0 - HSV.y * (1.0 - f);
		RGB.y *= 1.0 - HSV.y;
	} else if (i == 5) {
		RGB.z *= 1.0 - HSV.y * f;
		RGB.y *= 1.0 - HSV.y;
	}
	
	return RGB;
}

float interpolate(float a, float b, float x) {
	float f = (1.0 - cos(x * PI)) * 0.5;
	return a * (1.0 - f) + b * f;
}

float rnd(vec2 p) {
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float irnd(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec4 v = vec4(	rnd(vec2(i.x,		i.y		)),
		      	rnd(vec2(i.x + 1.0,	i.y		)),
		      	rnd(vec2(i.x,		i.y + 1.0	)),
		      	rnd(vec2(i.x + 1.0,	i.y + 1.0	)));
	return interpolate(interpolate(v.x, v.y, f.x), interpolate(v.z, v.w, f.x), f.y);
}

float noise(vec2 p) {
	float t = 0.0;
	for(int i = 0;i < oct; i++) {
		float freq = pow(2.0, float(i));
		float amp = pow(per, float(oct - i));
		t += irnd(vec2(p.x / freq, p.y / freq)) * amp;
	}
	return t;
}

void main( void ) {

	vec2 position = (gl_FragCoord.xy / resolution.xy );

	vec2 rotate = vec2(cos(time) * rmul, sin(time) * rmul);
	float n = noise((position + rotate + time / 9.0) * nmul);
	float n2 = 0.0;
	float anime = abs(sin(time) * 0.8 + 0.1);

	if(anime + 0.025 > n && n > anime) {
		n2 = 1.0;
	} else {
		n2 = 0.0;
	}
	
	vec3 color1 = HSVtoRGB(vec3(mod((position.x + time * 0.1) * 16.0 + position.y * 6.0, 1.0), 1.0, 1.0));
	
	vec3 color2 = vec3(n2, n2, n2);
	
	vec3 color = color1 * color2;
	gl_FragColor = vec4(color.x ,color.y ,color.z , 1.0 );

}
