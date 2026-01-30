#extension GL_OES_standard_derivatives : enable

//
// SILLY SPINNING BITWISE OPERATOR THING
// DUE TO GLSL SANDBOX ONLY ALLOWING SIGNED INTEGERS, THIS MIGHT NOT BE ACCURATE!
//

precision mediump float;

uniform float time;

	uniform vec2 mouse;
uniform vec2 resolution;

// IMPORTANT VARIABLES

int Alpha =	0xFF000000; // Useless but important to note.
int Red =	0x00FF0000;
int Green =	0x0000FF00;
int Blue =	0x000000FF;
int White =	0x00FFFFFF;

int maxInt =	2147483647;
int minInt =   -2147483648;

vec2 renderSize = vec2(256,256); // i don't think this has any performance impact.

// BITWISE OPERATOR FUNCTIONS

int LS(int val,int c) { return val*int(pow(2.,float(c))); } // Left Shift
int RS(int val,int c) { return val/int(pow(2.,float(c))); } // Right Shift
int OR(int a, int b) { // OR
	bool mustFlip = (a<0 != b<0);
	if (mustFlip) { 
		a = int(abs(float(a)));
		b = int(abs(float(b)));
	}
	int result = 0;
	int mask = 1;
	for (int bit = 0; bit <32 ; ++bit) {
		if ((mod(float(a),2.) != 0.) || (mod(float(b),2.) != 0.))
			result = result + mask;
		a /= 2;
		b /= 2;
		mask += mask;
	}
	return mustFlip ? -result-1 : result;
}
int AND(int a, int b) { // AND
	bool mustFlip = (a<0 != b<0);
	if (mustFlip) { 
		a = int(abs(float(a)));
		b = int(abs(float(b)));
	}
	int result = 0;
	int mask = 1;
	for (int bit = 0; bit <32 ; ++bit) {
		if ((mod(float(a),2.) != 0.) && (mod(float(b),2.) != 0.))
			result = result + mask;
		a /= 2;
		b /= 2;
		mask += mask;
	}
	return mustFlip ? -result : result; // apparently handles the sign bit if i do this, idk
}
int XOR(int a, int b) { // XOR (not to be confused with ^)
	bool mustFlip = (a<0 != b<0);
	if (mustFlip) { 
		a = int(abs(float(a)));
		b = int(abs(float(b)));
	}
	int result = 0;
	int mask = 1;
	for (int bit = 0; bit <32 ; ++bit) {
		if (mod(float(a),2.) + mod(float(b),2.) == 1.)
			result = result + mask;
		a /= 2;
		b /= 2;
		mask += mask;
	}
	return mustFlip ? -result-1 : result;
}

// ARGB (32-bit integer) to vec4

vec4 toColor(int val) {
	if (val > minInt && val < 0) val = White + val + 1; // rough (int->uint) underflow simulation
	int r = RS(AND(val,Red),16);
	int g = RS(AND(val,Green),8);
	int b = AND(val,Blue);
	return vec4(float(r)/255.,float(g)/255.,float(b)/255.,1);
}

// THE END (NOW STARTING THE MAIN EVENT!!)

void main( void ) {
	
	vec2 alphaPos = vec2(gl_FragCoord.x/resolution.x,1.-gl_FragCoord.y/resolution.y); // don't ask.
	vec2 pos = floor(renderSize * alphaPos);
	
	int i = int(pos.x + (renderSize.x*pos.y));
	int x = int(mod(pos.x,renderSize.x));
	int y = int(mod(pos.y,renderSize.y));
	int t = int(time*1000.);
		
	int xor = XOR(x,y);
	int xp = x-int(renderSize.x/2.);
	int yp = y-int(renderSize.y/2.);
	bool cc = (xp*xp + yp*yp) > 10000;
	int sx = int((cos(time)*float(xp))+(sin(time)*float(yp)));
	int sy = int((cos(time)*float(yp))+(-sin(time)*float(xp)));
	int sxor = XOR(sx,sy);
	gl_FragColor = toColor(cc ? xor : sxor);
	
}

// TOTALLY NOT STOLEN FROM https://daydun.com/random/compiler/ LOL!!!
// - JavierR100