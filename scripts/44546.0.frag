// SixteenSegmentDisplay.glsl
// 16 Segment Display Example v3
// rearranged source code by I.G.P.
// better comments added to source by Hekate

#ifdef GL_ES
precision highp float;
#endif

vec2 uv;

uniform float time;
uniform vec2 resolution;

const vec2 ch_size  = vec2(1.0, 2.0);              // character size (X,Y)
const vec2 ch_space = ch_size + vec2(1.0, 1.0);    // character distance Vector(X,Y)
      vec2 ch_start = vec2 (0.0, 0.0); // start position
      vec2 ch_pos   = vec2 (0.0, 0.0);             // character position(X,Y)
      vec3 ch_color = vec3 (0.0, 0.5, 2.5);        // character color (R,G,B)
const vec3 bg_color = vec3 (0.0, 0.0, 0.0);        // background color (R,G,B)
      int  ch_line  = 0;			   // current line of code the character is on

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

 4   / |    7
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

#define TEXT_START(p) ch_pos = ch_start = vec2(p); ch_line = __LINE__;
#define n0 ddigit(0x22FF,__LINE__);
#define n1 ddigit(0x0281,__LINE__);
#define n2 ddigit(0x1177,__LINE__);
#define n3 ddigit(0x11E7,__LINE__);
#define n4 ddigit(0x1189,__LINE__);
#define n5 ddigit(0x11EE,__LINE__);
#define n6 ddigit(0x11FE,__LINE__);
#define n7 ddigit(0x0087,__LINE__);
#define n8 ddigit(0x11FF,__LINE__);
#define n9 ddigit(0x11EF,__LINE__);

#define A ddigit(0x119F,__LINE__);
#define B ddigit(0x927E,__LINE__);
#define C ddigit(0x007E,__LINE__);
#define D ddigit(0x44E7,__LINE__);
#define E ddigit(0x107E,__LINE__);
#define F ddigit(0x101E,__LINE__);
#define G ddigit(0x807E,__LINE__);
#define H ddigit(0x1199,__LINE__);
#define I ddigit(0x4466,__LINE__);
#define J ddigit(0x4436,__LINE__);
#define K ddigit(0x9218,__LINE__);
#define L ddigit(0x0078,__LINE__);
#define M ddigit(0x0A99,__LINE__);
#define N ddigit(0x8899,__LINE__);
#define O ddigit(0x00FF,__LINE__);
#define P ddigit(0x111F,__LINE__);
#define Q ddigit(0x80FF,__LINE__);
#define R ddigit(0x911F,__LINE__);
#define S ddigit(0x8866,__LINE__);
#define T ddigit(0x4406,__LINE__);
#define U ddigit(0x00F9,__LINE__);
#define V ddigit(0x2218,__LINE__);
#define W ddigit(0xA099,__LINE__);
#define X ddigit(0xAA00,__LINE__);
#define Y ddigit(0x4A00,__LINE__);
#define Z ddigit(0x2266,__LINE__);
#define _ ch_pos.x += ch_space.x;if(__LINE__ != ch_line){ch_pos.x = ch_start.x;ch_pos.y -= ch_space.y;ch_line = __LINE__;}
#define s_dot     ddigit(0x0000,__LINE__);
#define s_minus   ddigit(0x1100,__LINE__);
#define s_plus    ddigit(0x5500,__LINE__);
#define s_greater ddigit(0x2800,__LINE__);
#define s_less    ddigit(0x8200,__LINE__);
#define s_sqrt    ddigit(0x0C02,__LINE__);

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

void ddigit(int n, int line)
{
	float v = 1e6;
	
	//Insert new line if line of code doesn't match (__LINE__ = current line of code)
	if(line != ch_line)
	{
		ch_pos.x = ch_start.x;
		ch_pos.y -= ch_space.y;
		ch_line = line;
	}

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
	uv *= 40.0 + sin(time);     //  set zoom size
	if (REPEAT_SIGN)
	  uv = -14.0 + mod(1.8*(uv-1.0),ch_space*vec2(16.,6.5));     //  set zoom size

	ch_pos = ch_start + vec2(sin(time),0.0);  // set start position
	
	TEXT_START(vec2(-15,6))
        A B O N N I E R T 
	_ T A P T _ A U F
        _ _ Y O U T U B E 
		
	vec3 color = mix(ch_color, bg_color, 1.0- (0.08 / d));  // shading
	gl_FragColor = vec4(color, 1.0);
}
