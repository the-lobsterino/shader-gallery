
#ifdef GL_ES
precision highp float;
#endif

// ↙
//  ↙
//   ↙
// http://66.media.tumblr.com/2a2f183dc4a6a040ff6535c5418b9403/tumblr_ncbj5rJvLI1tmxmpzo1_500.jpg
// u guys rock
#extension GL_OES_standard_derivatives : enable

vec2 uv;

uniform float time;
uniform vec2 resolution;

const vec2 ch_size  = vec2(1.0, 2.0) * 0.6;              // character size (X,Y)
const vec2 ch_space = ch_size + vec2(1.0, 1.0);    // character distance Vector(X,Y)
const vec2 ch_start = vec2 (ch_space.x * -5., 1.); // start position
      vec2 ch_pos   = vec2 (0.0, 0.0);             // character position(X,Y)
//      vec3 ch_color = vec3 (1.5, 0.75, 0.5);        // character color (R,G,B)
//const vec3 bg_color = vec3 (0.2, 0.2, 0.2);        // background color (R,G,B)

#define REPEAT_SIGN false // True/False; True=Multiple, False=Single

/* 16 segment display...Akin to LED Display.

Segment bit positions:
  __2__ __1__
 |\    |    /|
 | \   |   / |
 3  11 40 9  0
 |   \ | /   |
 |    \|/    |
  _1002__ __8__
 |           |
 |    /|\    |
 4   / | \   7
 | 13 14  15 |
 | /   |   \ |
  __5__|__6__

15 12 11 8 7  4 3  0
 |  | |  | |  | |  |
 0000 0000 0000 0000

example: letter A

   12    8 7  4 3210
    |    | |  | ||||
 0001 0001 1001 1111

 binary to hex -> 0x119F
*/

#define n0 ddigit(0x22FF);
#define n1 ddigit(0x0281);
#define n2 ddigit(0x1177);
#define n3 ddigit(0x11E7);
#define n4 ddigit(0x5508);
#define n5 ddigit(0x11EE);
#define n6 ddigit(0x11FE);
#define n7 ddigit(0x2206);
#define n8 ddigit(0x11FF);
#define n9 ddigit(0x11EF);

#define A ddigit(0x119F);
#define B ddigit(0x927E);
#define C ddigit(0x007E);
#define D ddigit(0x44E7);
#define E ddigit(0x107E);
#define F ddigit(0x101E);
#define G ddigit(0x807E);
#define H ddigit(0x1199);
#define I ddigit(0x4466);
#define J ddigit(0x4436);
#define K ddigit(0x9218);
#define L ddigit(0x0078);
#define M ddigit(0x0A99);
#define N ddigit(0x8899);
#define O ddigit(0x00FF);
#define P ddigit(0x111F);
#define Q ddigit(0x80FF);
#define R ddigit(0x911F);
#define S ddigit(0x8866);
#define T ddigit(0x4406);
#define U ddigit(0x00F9);
#define V ddigit(0x2218);
#define W ddigit(0xA099);
#define X ddigit(0xAA00);
#define Y ddigit(0x4A00);
#define Z ddigit(0x2266);
#define _ ch_pos.x += ch_space.x;
#define s_dot     ddigit(0);
#define s_minus   ddigit(0x1100);
#define s_plus    ddigit(0x5500);
#define s_greater ddigit(0x2800);
#define s_less    ddigit(0x8200);
#define s_sqrt    ddigit(0x0C02);
#define nl1 ch_pos = ch_start;  ch_pos.y -= 3.0;
#define nl2 ch_pos = ch_start;  ch_pos.y -= 6.0;
#define nl3 ch_pos = ch_start;	ch_pos.y -= 9.0;

float dseg(vec2 p0, vec2 p1)
{
	vec2 dir = normalize(p1 - p0);
	vec2 cp = (uv - ch_pos - p0) * mat2(dir.x, dir.y,-dir.y, dir.x);
	return distance(cp, clamp(cp, vec2(0), vec2(distance(p0, p1), 0)));   
}

bool bit(int n, int b)
{
	return mod(floor(float(n) / exp2(floor(float(b)))), 2.0) != 0.0;
}

float d = 1e6;

void ddigit(int n)
{
	float v = 1e6;	
	vec2 cp = uv - ch_pos;
	if (n == 0)     v = min(v, dseg(vec2(-0.405, -1.000), vec2(-0.500, -1.000)));
	if (bit(n,  0)) v = min(v, dseg(vec2( 0.500,  0.063), vec2( 0.500,  0.937)));
	if (bit(n,  1)) v = min(v, dseg(vec2( 0.438,  1.000), vec2( 0.063,  1.000)));
	if (bit(n,  2)) v = min(v, dseg(vec2(-0.063,  1.000), vec2(-0.438,  1.000)));
	if (bit(n,  3)) v = min(v, dseg(vec2(-0.500,  0.937), vec2(-0.500,  0.062)));
	if (bit(n,  4)) v = min(v, dseg(vec2(-0.500, -0.063), vec2(-0.500, -0.938)));
	if (bit(n,  5)) v = min(v, dseg(vec2(-0.438, -1.000), vec2(-0.063, -1.000)));
	if (bit(n,  6)) v = min(v, dseg(vec2( 0.063, -1.000), vec2( 0.438, -1.000)));
	if (bit(n,  7)) v = min(v, dseg(vec2( 0.500, -0.938), vec2( 0.500, -0.063)));
	if (bit(n,  8)) v = min(v, dseg(vec2( 0.063,  0.000), vec2( 0.438, -0.000)));
	if (bit(n,  9)) v = min(v, dseg(vec2( 0.063,  0.063), vec2( 0.438,  0.938)));
	if (bit(n, 10)) v = min(v, dseg(vec2( 0.000,  0.063), vec2( 0.000,  0.937)));
	if (bit(n, 11)) v = min(v, dseg(vec2(-0.063,  0.063), vec2(-0.438,  0.938)));
	if (bit(n, 12)) v = min(v, dseg(vec2(-0.438,  0.000), vec2(-0.063, -0.000)));
	if (bit(n, 13)) v = min(v, dseg(vec2(-0.063, -0.063), vec2(-0.438, -0.938)));
	if (bit(n, 14)) v = min(v, dseg(vec2( 0.000, -0.938), vec2( 0.000, -0.063)));
	if (bit(n, 15)) v = min(v, dseg(vec2( 0.063, -0.063), vec2( 0.438, -0.938)));
	
	v = v-min(0.3, dseg(vec2( sin(time), -sin(time)), vec2( sin(time), -sin(time)))+40.*cos(time));
	/*  - Mops - */
	ch_pos.x += ch_space.x;
	d = min(d, v);
}
mat2 rotate(float a)
{
	float c = cos(a);
	float s = sin(a);
	return mat2(c, s, -s, c);
}
vec3 hsv2rgb_smooth( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

	rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing	

	return c.z * mix( vec3(1.0), rgb, c.y);
}

// --------[ Original ShaderToy begins here ]---------- //
/*--------------------------------------------------------------------------------------
License CC0 - http://creativecommons.org/publicdomain/zero/1.0/
To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
----------------------------------------------------------------------------------------
^ This means do ANYTHING YOU WANT with this code. Because we are programmers, not lawyers.
-Otavio Good
*/

// Clamp [0..1] range
#define saturate(a) clamp(a, 0.0, 1.0)

// Got this line drawing algorithm from https://www.shadertoy.com/view/4tc3DX
// This function will make a signed distance field that says how far you are from the edge
// of the line at any point U,V.
// Pass it UVs, line end points, line thickness (x is along the line and y is perpendicular),
// How rounded the end points should be (0.0 is rectangular, setting rounded to thick.y will be circular),
// dashOn is just 1.0 or 0.0 to turn on the dashed lines.
float LineDistField(vec2 uv, vec2 pA, vec2 pB, vec2 thick, float rounded) {
    // Don't let it get more round than circular.
    //thick = vec2(0.005, 0.005);
    rounded = min(thick.y, rounded);
    // midpoint
    vec2 mid = (pB + pA) * 0.5;
    // vector from point A to B
    vec2 delta = pB - pA;
    // Distance between endpoints
    float lenD = length(delta);
    // unit vector pointing in the line's direction
    vec2 unit = delta / lenD;
    // Check for when line endpoints are the same
    if (lenD < 0.0001) unit = vec2(1.0, 0.0);	// if pA and pB are same
    // Perpendicular vector to unit - also length 1.0
    vec2 perp = unit.yx * vec2(-1.0, 1.0);
    // position along line from midpoint
    float dpx = dot(unit, uv - mid);
    // distance away from line at a right angle
    float dpy = dot(perp, uv - mid);
    // Make a distance function that is 0 at the transition from black to white
    float disty = abs(dpy) - thick.y + rounded;
    float distx = abs(dpx) - lenD * 0.5 - thick.x + rounded;

    // Too tired to remember what this does. Something like rounded endpoints for distance function.
    float dist = length(vec2(max(0.0, distx), max(0.0,disty))) - rounded;
    dist = min(dist, max(distx, disty));

    return dist;
}

// This makes a line in UV units. A 1.0 thick line will span a whole 0..1 in UV space.
float FillLine(vec2 uv, vec2 pA, vec2 pB, vec2 thick, float rounded) {
    float df = LineDistField(uv, pA, pB, vec2(thick), rounded);
    return saturate(df / abs(dFdy(uv).y));
}

float Wobble(float a, float seed) {
    //seed = floor(seed) * 3.14159 * 0.5;
    a += seed;
    return sin(a) + sin(a * 2.0)*0.5 + sin(a * 4.0)*0.25;
}

// makes a dancer in the 0..1 uv space. Seed is which dancer to draw.
float Dancer(vec2 uv, vec2 seed)
{
      

    float legLen = 0.18;
    float armLen = 0.15;

    // Define joint positions
    vec2 hipA = vec2(0.57,0.33);
    vec2 kneeA = vec2(0.65 + Wobble(time*1.8, seed.x*7.6543)*0.1, 0.2);
    vec2 footA = vec2(0.6 + Wobble(time*3., seed.x*237.6543)*0.1, 0.0);
    // Constrain joints to be a fixed length
    kneeA = normalize(kneeA - hipA) * legLen + hipA;
    footA = normalize(footA - kneeA) * legLen + kneeA;

    vec2 hipB = vec2(0.43,0.33);
    vec2 kneeB = vec2(0.35 + Wobble(time, seed.x*437.6543)*0.1, 0.2);
    vec2 footB = vec2(0.4 + Wobble(time, seed.x*383.6543)*0.1, 0.0);
    kneeB = normalize(kneeB - hipB) * legLen + hipB;
    footB = normalize(footB - kneeB) * legLen + kneeB;

    vec2 shoulderA = vec2(0.62, 0.67);
    vec2 elbowA = vec2(0.8, 0.43 + Wobble(time, seed.x*7.6543)*0.3);
    vec2 handA = elbowA + vec2(.14, 0.0 + Wobble(time, seed.x*73.6543)*0.5);
    elbowA = normalize(elbowA - shoulderA) * armLen + shoulderA;
    handA = normalize(handA - elbowA) * armLen + elbowA;

    vec2 shoulderB = vec2(0.38, 0.67);
    vec2 elbowB = vec2(0.2, 0.43 + Wobble(time, seed.x*17.6543)*0.3);
    vec2 handB = elbowB + vec2(-0.14, 0.0 + Wobble(time, seed.x*173.6543)*0.5);
    elbowB = normalize(elbowB - shoulderB) * armLen + shoulderB;
    handB = normalize(handB - elbowB) * armLen + elbowB;

    vec2 headPos = vec2(0.5 + Wobble(time*3., seed.x*573.6543)*0.03, 0.83 + sin(time*4.0)* 0.01);

    // Find an approximate center of mass on the x axis
    float balance = (kneeA.x + kneeB.x + footA.x + footB.x +
                    elbowA.x + elbowB.x + handA.x + handB.x +
                    headPos.x * 1.0) - (0.5*9.0);

    // Make the dancer stick to the ground even when they lift their legs.
    float ground = min(footA.y, footB.y);
    uv.y += ground - 0.025;
    // Make them counter-balance based on approximate center of mass
    uv.x += balance*0.1;

    // Torso
    float l = max(0.0, FillLine(uv, vec2(0.5,0.45), vec2(0.5,0.6), vec2(0.12,0.12), 0.0));

    // Legs
    l = min(l, FillLine(uv, kneeA, hipA, vec2(0.05,0.05), 1.0));
    l = min(l, FillLine(uv, kneeA, footA, vec2(0.05,0.05), 1.0));
    l = min(l, FillLine(uv, kneeB, hipB, vec2(0.05,0.05), 1.0));
    l = min(l, FillLine(uv, kneeB, footB, vec2(0.05,0.05), 1.0));

    // Arms
    l = min(l, FillLine(uv, elbowA, shoulderA, vec2(0.05,0.05), 1.0));
    l = min(l, FillLine(uv, elbowA, handA, vec2(0.05,0.05), 1.0));
    l = min(l, FillLine(uv, elbowB, shoulderB, vec2(0.05,0.05), 1.0));
    l = min(l, FillLine(uv, elbowB, handB, vec2(0.05,0.05), 1.0));

    // Head
    l = min(l, FillLine(uv, headPos, headPos, vec2(0.1,0.1), 1.0));

    // Optional skirt
    if (fract(seed.x*123.4567) > 0.5) {
        l = min(l, FillLine(uv, vec2(0.5, 0.55), vec2(0.65, 0.33), vec2(0.05,0.05), 1.0));
        l = min(l, FillLine(uv, vec2(0.5, 0.55), vec2(0.35, 0.33), vec2(0.05,0.05), 1.0));
        l = min(l, FillLine(uv, vec2(0.35, 0.33), vec2(0.65, 0.33), vec2(0.05,0.05), 1.0));
    }

    return l;
}



vec3 hex2rgb(int hexof){
	float fhexof = float(hexof);
	float b = mod(fhexof, 256.);
	fhexof -= b;
	fhexof /= 256.;
	float g = mod(fhexof, 256.);
	fhexof -= g;
	fhexof /= 256.;
	float r = mod(fhexof, 256.);
	return vec3(r,g,b)/255.;
}

float ease_in_out(float x){
	x = fract(x);
	//const float a = 2.;
	const float a = 2.;
	return pow(x, a)/(pow(x, a) + pow(1.-x, a));
}

vec3 skintones(float orientation){
	const int c1 = 0x322d26;
	const int c2 = 0x3d230b;
	const int c3 = 0x4b392f;
	const int c4 = 0x694d3f;
	const int c5 = 0x7e6453;
	const int c6 = 0x95775b;
	const int c7 = 0xb59a7f;
	const int c8 = 0xdfc19a;
	const int c9 = 0xe1b8b2;
	const int cA = 0xefd0cf;
	const int cB = 0xfbeded;
	orientation = fract(orientation)*2.;
	if(orientation >= 1.) orientation = 2.-orientation;
	orientation = fract(orientation)*12.;
	if(orientation <= 1.) return mix(hex2rgb(c1), hex2rgb(c1), ease_in_out(orientation));
	if(orientation <= 2.) return mix(hex2rgb(c1), hex2rgb(c2), ease_in_out(orientation));
	if(orientation <= 3.) return mix(hex2rgb(c2), hex2rgb(c3), ease_in_out(orientation));
	if(orientation <= 4.) return mix(hex2rgb(c3), hex2rgb(c4), ease_in_out(orientation));
	if(orientation <= 5.) return mix(hex2rgb(c4), hex2rgb(c5), ease_in_out(orientation));
	if(orientation <= 6.) return mix(hex2rgb(c5), hex2rgb(c6), ease_in_out(orientation));
	if(orientation <= 7.) return mix(hex2rgb(c6), hex2rgb(c7), ease_in_out(orientation));
	if(orientation <= 8.) return mix(hex2rgb(c7), hex2rgb(c8), ease_in_out(orientation));
	if(orientation <= 9.) return mix(hex2rgb(c8), hex2rgb(c9), ease_in_out(orientation));
	if(orientation <= 10.) return mix(hex2rgb(c9), hex2rgb(cA), ease_in_out(orientation));
	if(orientation <= 11.) return mix(hex2rgb(cA), hex2rgb(cB), ease_in_out(orientation));
	if(orientation <= 12.) return mix(hex2rgb(cB), hex2rgb(cB), ease_in_out(orientation));
	return hex2rgb(0x322d26);
}
void main( void ) 
{
	
	vec2 aspect = resolution.xy / resolution.y;
	uv = ( gl_FragCoord.xy / resolution.y ) - aspect / 2.0;
	float _d =  1.0-length(uv);
	uv *= 12.0 ;
	//uv *= rotate(time+uv.x*0.05);

	vec3 ch_color = hsv2rgb_smooth(vec3(time*0.4+uv.y*0.1,0.5,1.0));

	vec3 bg_color = vec3(_d*0.4, _d*0.2, _d*0.1);
	uv.x += 0.5+sin(time+uv.x*pow(uv.y,0.6)*cos(time))*0.2;
	ch_pos = vec2(-3.4,1.0*abs(sin(time)*1.2))+ch_start;

                   H O E S _ M A D _ H O E S _ M A D 
			 
		
	vec3 color =  2.0-mix(ch_color, bg_color,  (0.04 / d*5.0));  // shading
	//gl_FragColor = vec4(1.-color, 1.0);
	
	
	vec2 uv2 = gl_FragCoord.xy /resolution.xy;
	uv2.x *= resolution.x / resolution.y;
	//uv2.x += time * 0.08;	// scroll left with time

	// make a grid for drawing.
	uv2 *= 2.7;// * (sign(iMouse.z) + 2.0);
	uv2.y *= 0.9;
        uv2.y += 1.0;
	vec2 newSeed = floor(uv2);

    // Make those dancing people!
	float finalLine = Dancer(fract(uv2), newSeed-0.41);
	if(finalLine <= 0.01) ch_color = 1.-skintones(Wobble(time*0.01, newSeed.x*1.234));
    finalLine *= mod(newSeed.y, 2.0);  // the mod kills every other line.
	

    float lseed = length(newSeed);
    vec3 backColor = vec3(sin(lseed), cos(lseed*918.7654), sin(lseed * 3.4567))*0.5+0.5;
    backColor = normalize(max(backColor, vec3(0.1,0.1,0.1)))+0.04;
    vec3 finalColor = backColor * finalLine;
	if (uv2.y>3.0) gl_FragColor = vec4(0.0,0.0,0.0,0.0); 
		else
	gl_FragColor = vec4(1.-mix(ch_color, bg_color,  (0.04 / d*5.0))+sqrt(-finalColor),1.0); 
	
	// Mixing shader !!
}