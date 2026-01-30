// Coil Snake
// Battle Background Animation
// Based on the original animation in Earthbound
// ported by @ROFISH

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

float dir(vec2 a, vec2 b) {
	return (a.x * b.y) - (a.y * b.x);
}

bool insideTri(vec2 p, vec2 a, vec2 b, vec2 c) {
	bool b1 = dir(p - a, b - a) > 0.0;
	bool b2 = dir(p - b, c - b) > 0.0;
	bool b3 = dir(p - c, a - c) > 0.0;
	
	return (b1 == b2) && (b2 == b3);
}

bool insideRect(vec2 p, vec2 a, vec2 b) {
	bool rx = p.x >= a.x && p.x <= b.x;
	bool ry = p.y >= a.y && p.y <= b.y;
	return rx && ry;
}

vec3 palette(float paletteNum) {
	vec3 ret = vec3(0);
	if (paletteNum == 0.0)
		ret = vec3(200.0/256.0,64.0/256.0,40.0/256.0);
	else if (paletteNum == 1.0)
		ret = vec3(200.0/256.0,40.0/256.0,40.0/256.0);
	else if (paletteNum == 2.0)
		ret = vec3(200.0/256.0,40.0/256.0,64.0/256.0);
	else if (paletteNum == 3.0)
		ret = vec3(200.0/256.0,32.0/256.0,88.0/256.0);
	else if (paletteNum == 4.0)
		ret = vec3(200.0/256.0,32.0/256.0,112.0/256.0);
	else if (paletteNum == 5.0)
		ret = vec3(200.0/256.0,32.0/256.0,136.0/256.0);
	else if (paletteNum == 6.0)
		ret = vec3(200.0/256.0,32.0/256.0,160.0/256.0);
	else if (paletteNum == 7.0)
		ret = vec3(200.0/256.0,32.0/256.0,144.0/256.0);
	else if (paletteNum == 8.0)
		ret = vec3(200.0/256.0,32.0/256.0,128.0/256.0);
	else if (paletteNum == 9.0)
		ret = vec3(200.0/256.0,32.0/256.0,112.0/256.0);
	else if (paletteNum == 10.0)
		ret = vec3(200.0/256.0,32.0/256.0,76.0/256.0);
	else if (paletteNum == 11.0)
		ret = vec3(200.0/256.0,40.0/256.0,72.0/256.0);
	else if (paletteNum == 12.0)
		ret = vec3(200.0/256.0,40.0/256.0,56.0/256.0);
	else if (paletteNum == 13.0)
		ret = vec3(200.0/256.0,40.0/256.0,40.0/256.0);
	else if (paletteNum == 14.0)
		ret = vec3(200.0/256.0,64.0/256.0,40.0/256.0);
	else if (paletteNum == 15.0)
		ret = vec3(200.0/256.0,40.0/256.0,40.0/256.0);
	else if (paletteNum == 16.0)
		ret = vec3(200.0/256.0,40.0/256.0,64.0/256.0);
	else if (paletteNum == 17.0)
		ret = vec3(200.0/256.0,32.0/256.0,88.0/256.0);
	else if (paletteNum == 18.0)
		ret = vec3(200.0/256.0,32.0/256.0,112.0/256.0);
	else if (paletteNum == 19.0)
		ret = vec3(200.0/256.0,32.0/256.0,136.0/256.0);
	else if (paletteNum == 20.0)
		ret = vec3(200.0/256.0,32.0/256.0,160.0/256.0);
	else if (paletteNum == 21.0)
		ret = vec3(200.0/256.0,32.0/256.0,144.0/256.0);
	else if (paletteNum == 22.0)
		ret = vec3(200.0/256.0,32.0/256.0,128.0/256.0);
	else if (paletteNum == 23.0)
		ret = vec3(200.0/256.0,32.0/256.0,112.0/256.0);
	else if (paletteNum == 24.0)
		ret = vec3(200.0/256.0,32.0/256.0,76.0/256.0);
	else if (paletteNum == 25.0)
		ret = vec3(200.0/256.0,40.0/256.0,72.0/256.0);
	if (paletteNum == 26.0)
		ret = vec3(200.0/256.0,40.0/256.0,56.0/256.0);
	else if (paletteNum == 27.0)
		ret = vec3(200.0/256.0,40.0/256.0,40.0/256.0);
	return ret;
}

bool insideRupee(vec2 pos) {
	bool ret = false;
	vec2 a = vec2(1, 1.0-7.0/22.0);
	vec2 b = vec2(0, 1.0-7.0/22.0);
	vec2 c = vec2(0.5, 1);
	
	vec2 ra = vec2(0,7.0/22.0);
	vec2 rb = vec2(1,1.0-7.0/22.0);
	
	vec2 wa = vec2(1, 7.0/22.0);
	vec2 wb = vec2(0, 7.0/22.0);
	vec2 wc = vec2(0.5, 0);
	
	if (insideTri(pos, a, b, c))
	   ret = true;
	if (insideRect(pos,ra,rb))
	   ret = true;
	if (insideTri(pos, wa, wb, wc))
	   ret = true;
	return ret;
}

#define PI		(4.*atan(1.))
#define AMPLIFICATION   8192.0
#define FREQUENCY       1024.0
#define SPEED           2.0

float appliedOffset() {
	float C1 = 1.0/512.0;
	float C2 = 8.0 * PI / (1024.0 * 256.0);
	float C3 = PI / 60.0;
	// the SNES was from the top left to bottom right, however GLSL is bottom left to top right, so we need to negate it
	// also, the resolution of the SNES is 256x224, so it assumed a screen size of 224px heigh.
	// that's why we use a percentage of 224 hieght screensize.
	float S = C1 * AMPLIFICATION * sin (C2 * FREQUENCY * -(gl_FragCoord.y/resolution.y)*224.0 + C3 * SPEED * time*30.0);
	
	
	
	// type 2 horizontal interlace
	// the original EB ROM interlaced every frame, which is 224 px high
	// this simulates the size of the SNES to interlace like an SNES sized screen
	// float interlace_factor = resolution.y/224.0;
	// if (resolution.y < 224.0)
	// 	interlace_factor = 1.0;
	//if (mod(gl_FragCoord.y/interlace_factor,2.0) > 1.0) {
	//	S *= -1.0;
	//}
	
	
	
	// type 3 vertial sinusoidal
	// the original EB rom background was always 256x256 high image that was manipulated
	// type 3 gave a offset for each y based on time
	// except the original algorithm was a integer offset based on the original 256x256 size
	// so the resolution factor converts this into any resolution
	float resolution_factor = S/256.0 * resolution.y;
	
	float L = (gl_FragCoord.y + resolution_factor)/resolution.y;
	if (L < 0.0)
		L = 1.0+L;
	if (L > 1.0)
		L = 1.0-L;
	
	return L;
}

void main(void){
	// gl_FragCoord contains the literal location of the pixel
	// resolution contains the desired resolution (in the case of glsl sandbox,
	// the desired resolution is a multiple of actual resolution)
	vec2 pos = gl_FragCoord.xy / resolution.xy;
	vec2 spacing = vec2(1.0,1.5);
	// this forces a standard x based on y?
	pos.x *= (resolution.x / resolution.y);
	
	float timestep = floor(mod(time*10.0,14.0));
	vec3 color = palette(timestep);
	
	pos.x = pos.x*16.0;
	// glsl has a bad habit of going the wrong direction :P
	pos.y = (1.0-appliedOffset())*12.0;
	
	float y_num = floor(pos.y/spacing.y);
	float revsign = 1.0;
	if (mod(y_num,2.0) == 0.0)
		revsign = -1.0;
	float x_num = mod(floor(pos.x)+(revsign*y_num*3.0),14.0);
	
	pos.x = mod(pos.x,spacing.x);
	pos.y = mod(pos.y,spacing.y)-0.5;
	
	if (insideRupee(pos))
	  color = palette(abs(timestep+(x_num*revsign)));
	
	gl_FragColor = vec4(color, 1);
	//gl_FragColor = vec4(0,0,PI/5.14,1);
	//gl_FragColor = vec4(pos.x,pos.y,0,1);
	//gl_FragColor = vec4(appliedOffset(),0,0,1);
}
	