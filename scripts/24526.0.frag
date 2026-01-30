#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//Just like Harry Potter Playstation 2 games when you open up the inventory. Is it hard to explain?
//Gotta love perlin noise for that.
//
//Picture:
//http://postimg.org/image/thckovrgz/
//


const float pi = 3.1415926535897932384626433832795;

float Random(vec2 co) {
	float an = fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
	float bn = fract(sin(dot(co.xy ,vec2(13.998,78.23))) * 43758.5453);
	float cn = fract(sin(dot(co.xy ,vec2(13.9928,75.23))) * 4358.5453);
	float dn = fract(sin(dot(co.xy ,vec2(13.9228,65.423))) * 4358.5453);
	//Animating noise.
	return mix(an+(cos(cn*time)/3.0),bn+(sin(cn+time)/20.0),dn+((sin(time)/4.)+0.2));
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
	pos.x += time*32.0;
	float perlin = 0.0;
	const int layers = 10;
	for(int i = 0; i < layers; i++) {
		perlin += interpolatedNoise(pos/pow(2.0,float(i)))/pow(1.5,float(layers-i));
		perlin -= 0.04;
	}
	return perlin;
}

void main( void ) {
	float perlin = Perlin(gl_FragCoord.xy);
	//Red version:
	//gl_FragColor = vec4(perlin*1.2, pow(perlin,4.0)/2.0, perlin/4.0, 1.0);
	
	//Damn I fucking suck at leveling colors with math.
	gl_FragColor = vec4((vec3(pow(perlin,2.)/2.0+0.1, pow(perlin,0.2)/4.0+0.04, pow(perlin,1.2)+0.56)/2.0+(vec3(perlin)/2.5))/4.0, 1.0);
}