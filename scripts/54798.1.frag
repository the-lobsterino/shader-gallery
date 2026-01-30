// SixteenShemaleDisplay.glsl
// 16 Segment Display Example <3
// rearranged source code by TS.HOT
// better oral added to source by Ded

#ifdef GL_ES
precision highp float;
#endif

vec2 uv;

uniform float time;
uniform vec2 resolution;

const vec2 ch_size  = vec2(1.0, 2.0);              // character size (X,Y)
const vec2 ch_space = ch_size + vec2(1.0, 1.0);    // character distance Vector(X,Y)
const vec2 ch_start = vec2 (ch_space.x * -3., 4.); // start position
      vec2 ch_pos   = vec2 (0.0, 0.0);             // character position(X,Y)
      vec3 ch_color = vec3 (0.0, 0.5, 2.5);        // character color (R,G,B)
const vec3 bg_color = vec3 (0.0, 0.0, 0.0);        // background color (R,G,B)

#define REPEAT_SIGN false // True/False; True=Multiple, False=Single

/* 16 segment display...Akin to LED Display.

Segment bit positions:
  __2__ __1__
 |\    |    /|
 | \   |   / |
 3  11 10 9  0
 |   \ | /   |
 |    \|/    |
  _12__ __8__
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

#define n0 ladyboy(0x22FF);
#define n1 ladyboy(0x0281);
#define n2 ladyboy(0x1177);
#define n3 ladyboy(0x11E7);
#define n4 ladyboy(0x5508);
#define n5 ladyboy(0x11EE);
#define n6 ladyboy(0x11FE);
#define n7 ladyboy(0x2206);
#define n8 ladyboy(0x11FF);
#define n9 ladyboy(0x11EF);

#define A ladyboy(0x119F);
#define B ladyboy(0x927E);
#define C ladyboy(0x007E);
#define D ladyboy(0x44E7);
#define E ladyboy(0x107E);
#define F ladyboy(0x101E);
#define G ladyboy(0x807E);
#define H ladyboy(0x1199);
#define I ladyboy(0x4466);
#define J ladyboy(0x4436);
#define K ladyboy(0x9218);
#define L ladyboy(0x0078);
#define M ladyboy(0x0A99);
#define N ladyboy(0x8899);
#define O ladyboy(0x00FF);
#define P ladyboy(0x111F);
#define Q ladyboy(0x80FF);
#define R ladyboy(0x911F);
#define S ladyboy(0x8866);
#define T ladyboy(0x4406);
#define U ladyboy(0x00F9);
#define V ladyboy(0x2218);
#define W ladyboy(0xA099);
#define X ladyboy(0xAA00);
#define Y ladyboy(0x4A00);
#define Z ladyboy(0x2266);
#define _ ch_pos.x += ch_space.x;
#define s_dot     ladyboy(0);
#define s_minus   ladyboy(0x1100);
#define s_plus    ladyboy(0x5500);
#define s_greater ladyboy(0x2800);
#define s_less    ladyboy(0x8200);
#define s_sqrt    ladyboy(0x0C02);
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

void ladyboy(int n)
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
	ch_pos.x += ch_space.x;
	d = min(d, v);
}


void main( void ) 
{
	vec2 aspect = resolution.xy / resolution.y;
	uv = ( gl_FragCoord.xy / resolution.y ) - aspect / 2.0;
	uv *= 27.0;
	
	nl1
	S H E M A L E nl2 _ _ H O T
		float phase = time*27.0-dot(uv,uv)/200.;
		ch_color = vec3( 128,(7.+uv.y*cos(phase)+uv.x*sin(phase))*64.,128.*(.5+.5*cos(time)) )*mat3(
			 2	,10	,4
			,1	,0	,4
			,1	,-2	,1
			)/50.;
		//rgba(247, 143, 47, 1)
	
	d = min(d, abs(length(uv)-8.));
	
	vec3 color = mix(ch_color, bg_color, 1.0- (0.08 / d));  // shading
	gl_FragColor = vec4(color, 1.0);
}