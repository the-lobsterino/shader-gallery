#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.1415926535897932384626433832795;

float Random(vec2 co) {
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float interpolatedNoise(vec2 pos) {
	vec2 fac = fract(pos);
	fac.x = (cos(fac.x*pi)-1.0)/(-2.0);
	fac.y = (cos(fac.y*pi)-1.0)/(-2.0);
	pos = floor(pos);
	float r00 = Random(pos);
	float r01 = Random(pos+vec2(1.0,0));
	float r10 = Random(pos+vec2(0,1.0));
	float r11 = Random(pos+vec2(1.0,1.0));
	float r0 = r00*(1.0-fac.x) + r01*fac.x;
	float r1 = r10*(1.0-fac.x) + r11*fac.x;
	return r0*(1.0-fac.y) + r1*fac.y;
}

float Perlin(vec2 pos) {
	//return interpolatedNoise(pos/16.0);
	pos.y += time*10.0;
	float perlin = 0.0;
	const int layers = 13;
	for(int i = 0; i < layers; i++) {
		perlin += interpolatedNoise(pos/pow(1.9,float(i)))/pow(1.55,float(layers-i));
		perlin -= 0.055;
	}
	return perlin;
}

void main( void ) {
	float perlin = Perlin(gl_FragCoord.xy);
	gl_FragColor = vec4(vec3(perlin), 2.0);
}