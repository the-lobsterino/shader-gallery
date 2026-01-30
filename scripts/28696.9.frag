#ifdef GL_ES
precision mediump float;
#endif

// Missile command!!!!! (sort of)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float aVoid = 0.9;
float aSplode = 0.8;
float aBombL = 0.7;
float aBombR = 0.6;
float aShot = 0.5;
float aTower = 0.4;
float aNuke = 0.3;

float rand(int seed) {
	// Random float based on time, location and seed
	return fract(sin(time*23.254 + float(seed)*438.5345 - gl_FragCoord.x*37.2342 + gl_FragCoord.y * 73.25423)*3756.234);
}

float yrand() {
	// Random float based on time and Y coord
	return fract(sin(time*23.254 + gl_FragCoord.y*37.2342)*3756.234);
}

bool is(vec4 px, float material) {
	// Test for specific material
	return (abs(px.a - material) < 0.045);
}

vec4 px(int dx, int dy) {
	// Fetch pixel RGBA at relative location
	vec2 pos = vec2(gl_FragCoord.x - float(dx), gl_FragCoord.y - float(dy));
	if ((pos.x < 0.0) || (pos.y < 0.0) || (pos.x >= resolution.x) || (pos.y >= resolution.y)) {
		return vec4(0.0);
	}
	return texture2D(backbuffer, pos / resolution);
}

void main( void ) {
	vec2 position = gl_FragCoord.xy / resolution.xy;
	vec2 mdist = gl_FragCoord.xy - mouse * resolution;
	position.x -= 0.5;
	position.x *= resolution.x/resolution.y;
	
	// Mouse causes shots in regular intervals
	if ((length(mdist) < 2.5) && (fract(time*0.85) < 1.0/30.0) && (mouse.y > 0.25)) {
		gl_FragColor.rgb = vec3(1.0, 1.0-mouse.y, 1.0-mouse.y);
		gl_FragColor.a = aShot;
		return;
	}
	
	// Test -- is this pixl in a bomb's path?
	vec4 bombpath = vec4(-1);
	vec4 bombl = px((yrand()<0.5)?0:-1,-1);
	if (is(bombl, aBombL)) {bombpath = bombl;}
	vec4 bombr = px((yrand()<0.5)?0:1,-1);
	if (is(bombr, aBombR)) {bombpath = bombr;}
	
	// Neighbor pixels
	vec4 here = px(0,0);
	vec4 pxl = px(-1,0);
	vec4 pxr = px(1,0);
	vec4 pxu = px(0,1);
	vec4 pxd = px(0,-1);
	
	// Growing explosion wave
	vec4 isSplode = vec4(-1.0);
	if ((rand(1)<pxl.r) && (is(pxl, aSplode))) {isSplode = pxl;}
	if ((rand(2)<pxr.r) && (is(pxr, aSplode)) && (pxr.r > isSplode.r)) {isSplode = pxr;}
	if ((rand(3)<pxu.r) && (is(pxu, aSplode)) && (pxu.r > isSplode.r)) {isSplode = pxu;}
	if ((rand(4)<pxd.r) && (is(pxd, aSplode)) && (pxd.r > isSplode.r)) {isSplode = pxd;}
	if (is(here, aSplode) && (here.r > isSplode.r)) {isSplode = here;}
	isSplode.rgb -= vec3(1.0/255.0, 2.0/255.0, 4.0/255.0) * ((17.0 * rand(5))-1.0);
	if ((isSplode.a > 0.0) && (isSplode.r > 0.0) && !(is(here, aTower))) {
		if ((bombpath.a > 0.0) || (is(here, aShot))) {
			// Explosions trigger player shots and enemy bombs to explode
			gl_FragColor.rgb = vec3(1.0);
		} else {
			gl_FragColor.rgb = isSplode.rgb;
		}
		gl_FragColor.a = aSplode;
		return;
	}

	// Shots glow brighter until they explode
	if (is(here, aShot)) {
		gl_FragColor.rgb = here.rgb + 0.04*rand(83);
		gl_FragColor.a = ((here.g >= 1.0) || (bombpath.a > 0.0)) ? aSplode : aShot;
		return;
	}
	
	// Bombs drop randomly from top row
	if ((abs(resolution.y - gl_FragCoord.y -1.0) < 1.0) && (rand(30) < 0.1) && (rand(33) < 0.1) && (rand(38) < 0.05) && (rand(40) < 0.03)) {
		gl_FragColor.rgb = vec3(0.0, 0.5+rand(25), 0.0);
		gl_FragColor.a = (rand(88) < (gl_FragCoord.x/resolution.x)) ? aBombL : aBombR;
		return;
	}

	// Bombs fall downwards diagonally
	if (bombpath.a > 0.0) {
		if (is(here, aTower)) {
			gl_FragColor.rgb = vec3(1.0);
			gl_FragColor.a = aNuke;
			return;
		}
		gl_FragColor.rgb = vec3(0.0, 0.5+rand(25), 0.0);
		gl_FragColor.a = bombpath.a;
		return;
	}

	// Growing nuke wave
	vec4 isNuke = vec4(-1.0);
	if ((rand(1)<pxl.r) && (is(pxl, aNuke))) {isNuke = pxl;}
	if ((rand(2)<pxr.r) && (is(pxr, aNuke)) && (pxr.r > isNuke.r)) {isNuke = pxr;}
	if ((rand(3)*0.1<pxu.r) && (is(pxu, aNuke)) && (pxu.r > isNuke.r)) {isNuke = pxu;}
	if ((rand(4)<pxd.r) && (is(pxd, aNuke)) && (pxd.r > isNuke.r)) {isNuke = pxd; isNuke.rgb -= rand(53) * 0.025;}
	if (is(here, aNuke) && (here.r > isNuke.r)) {isSplode = here;}
	isNuke.rgb -= vec3(2.0/255.0, 1.0/255.0, 4.0/255.0) * ((17.0 * rand(5))-2.3);
	if ((isNuke.a > 0.0) && (isNuke.g > 0.0)) {
		gl_FragColor.rgb = isNuke.rgb;
		gl_FragColor.a = aNuke;
		return;
	}
	
	
	// Towers persist
	if (is(here, aTower) || (gl_FragCoord.y < 1.1)) {
		gl_FragColor = here;
		gl_FragColor.a = aTower;
		return;
	}
	
	// Tower setup
	if (here.a == 0.0) {
		float bnum = floor(position.x * 40.0);
		float bheight = 0.01 + 0.18 * fract(sin(bnum)*37.234234);
		if (position.y < bheight) {
			gl_FragColor.rgb = vec3(0);
			gl_FragColor.a = aTower;
			return;
		}
	}

	// Bombs leave trails
	if ((here.g > here.r) && (here.b == 0.0)) {
		gl_FragColor.rgb = here.rgb - 0.05 * rand(55);
		gl_FragColor.a = aVoid;
		return;
	}
	
	// Sky glow
	vec2 glow = position;
	glow.y *= 2.5;
	gl_FragColor.rgb = vec3(0.0, 0.05, 0.15) + vec3(0.25, 0.12, 0.1) * (1.0-length(glow)) + vec3(1.0/255.0)*rand(25);
	float line = (0.005 - abs(0.25 - gl_FragCoord.y/resolution.y)) / 0.01;
	if (line > 0.0) {gl_FragColor.rgb += vec3(0.1, 0.2, 0.4) * line;}
	gl_FragColor.a = aVoid;
}