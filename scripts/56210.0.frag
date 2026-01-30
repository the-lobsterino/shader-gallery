
//-------------------------------------------------------------------
// SixteenSegmentDisplayV4.glsl                   17-07-2019
// 16 Segment Display Example v4.3
// had to try something differant [ShadyGaDa]
// http://glslsandbox.com/e#28623
// Do you know further optimizations ? 
// Question: Extremely high memory usage at startup - why?
// hint: change neon colors by moving around with your mouse!
//-------------------------------------------------------------------

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec2 ch_size  = vec2(0.833, 0.833);              // character size
const vec2 ch_space = ch_size + vec2(0.5, 0.5);    // character distance  
const vec2 ch_start = vec2 (ch_space.x * -10.,2.0);// start position
      vec2 ch_pos   = vec2 (0.0, 0.0);             // character position
      vec3 ch_color = vec3 (0.5, 1.5, 0.5);        // character color
const vec3 bg_color = vec3 (0.0, 0.0, 0.0);        // background color

vec2 uv = vec2(0.);    // current position
// ─│┌┐└┘├┤┬┴┼═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬▀▄█▌▐░▒▓■□▪▫
/*========== 16 segment hex display ==========    bin. hex
               ͟͟͟͟͟                                   0000 0
Segment bit positions:                            0001 1
                                                  0010 2
  __2__ __1__         any bit adds one segment    0011 3
 │\    │    /│                                    0100 4
 │ \   │   / │     bit:    FEDC BA98 7654 3210    0101 5
 │  \  A  /  │             |||| |||| |||| ||||    0110 6
 3   B │ 9   0   binary:   0000 0000 0000 0000    0111 7
 │    \│/    │                                    1000 8
 │__C__│__8__│        example: letter A           1001 9
 │     │     │                                    1010 A
 4    /│\    7             FEDC BA98 7654 3210    1011 B
 │   D │ F   │             |||| |||| |||| ||||    1100 C
 │  /  E  \  │             0001 0001 1001 1111    1101 D
 │ /   │   \ │                                    1110 E
 │__5__│__6__│         binary to hex -> 0x119F    1111 F

FEDC BA98 7654 3210
|||| |||| |||| ||||
0000 0000 0001 1000  left bar  Lb bin to hex -> 0x0018 Lb
0000 0000 1000 0001  rite bar  Rb bin to hex -> 0x0081 Rb
0000 0000 0000 0110  top bar   tb bin to hex -> 0x0006 tb
0001 0001 0000 0000  mid bar   mb bin to hex -> 0x1100 mb
0000 0000 0110 0000  low bar   lb bin to hex -> 0x0060 lb
0000 0000 0001 1110  top left corner tlc b2h -> 0x001E tlc
0000 0000 1000 0111  top rite corner trc b2h -> 0x0087 trc
0000 0000 0111 1000  low left corner llc b2h -> 0x0078 llc
0000 0000 1110 0001  low rite corner lrc b2h -> 0x00E1 lrc

                                                  0000 0
old decimal Segment bit positions:                0001 1
                                                  0010 2
  __2__ __1__         any bit adds one segment    0011 3
 |\    |    /|                                    0100 4
 | \   |   / |     bit:   15 12 11 8 7654 3210    0101 5
 3  11 10 9  0             |  | |  | |||| ||||    0110 6
 |   \ | /   |    binary:  0000 0000 0000 0000    0111 7
 |    \|/    |                                    1000 8
  _12__ __8__         example: letter A           1001 9
 |           |                                    1010 A
 |    /|\    |            15 12 11 8 7654 3210    1011 B
 4   / | \   7             |  | |  | |||| ||||    1100 C
 | 13 14  15 |             0001 0001 1001 1111    1101 D
 | /   |   \ |                                    1110 E
  __5__|__6__          binary to hex -> 0x119F    1111 F

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

#define Lb ddigit(0x0018);
#define Rb ddigit(0x0081);

#define tb ddigit(0x0006);
#define mb ddigit(0x1100);
#define lb ddigit(0x0060);

#define tlc ddigit(0x001E);
#define trc ddigit(0x0087);
#define llc ddigit(0x0078);
#define lrc ddigit(0x00E1);


#define s_dot     ddots(0);
#define s_ddot    ddots(1);
//#define s_minus   ddigit(0x1100); //repl mb
#define s_plus    ddigit(0x5500);
#define s_mult    ddigit(0xBB00);
#define s_div     ddigit(0x2200);
#define s_more    ddigit(0x2800);  //repl greater more 
#define s_less    ddigit(0x8200);
#define s_open    ddigit(0x003C);
#define s_close   ddigit(0x00C3);
#define s_sqrt    ddigit(0x0C02);
//#define s_uline   ddigit(0x0060); repl lb
#define _  ch_pos.x += ch_space.x;  // blanc
#define nl ch_pos.x = ch_start.x;  ch_pos.y -= 2.0;

//-------------------------------------------------------------------
float dseg(vec2 p0, vec2 p1) {   // draw segment
  p0 *= ch_size;
  p1 *= ch_size;
  vec2 dir = normalize(p1 - p0);
  vec2 cp = (uv - ch_pos - p0) * mat2(dir.x, dir.y,-dir.y, dir.x);
  return 2.0*distance(cp, clamp(cp, vec2(0), vec2(distance(p0, p1), 0)));
}

bool bit(int n, int b) { // return true if bit b of n is set
  return mod(floor(float(n) / exp2(floor(float(b)))), 2.0) != 0.0;
}
float d = 1.0;
void ddots(int n) {
  float              v = 1.0;
  if      (n == 0)   v = min(v, dseg(vec2(-0.005, -1.000), vec2( 0.000, -1.000)));
  else if (n == 1) { v = min(v, dseg(vec2( 0.005, -1.000), vec2( 0.000, -1.000))); 
                     v = min(v, dseg(vec2( 0.005,  0.000), vec2( 0.000,  0.000))); 
  }
  ch_pos.x += ch_space.x;
  d = min(d, v);
}
void ddigit(int n) {
  float v = 1.0;
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

//-------------------------------------------------------------------
// show one digit
void showDigit (float dd) {
    if      (dd < 0.5) n0
    else if (dd < 1.5) n1
    else if (dd < 2.5) n2
    else if (dd < 3.5) n3
    else if (dd < 4.5) n4
    else if (dd < 5.5) n5
    else if (dd < 6.5) n6
    else if (dd < 7.5) n7
    else if (dd < 8.5) n8
    else if (dd < 9.5) n9
}

void showFloat (float value) {
  for(int ni = 4; ni > -3; ni--) {
    if (ni == -1) s_dot;   // add dot
    float dd = (value / pow(10.0,float(ni)));
    dd = mod(floor(dd), 10.0);
    showDigit (dd);
  }
}

// show integer value with 5 digits and leading zero digits
void showInteger5 (int value) {
  float fv = float(value);
  for(int ni = 4; ni >= 0; ni--)  {
    float dd = fv / pow(10.0,float(ni));
    dd = mod(floor(dd), 10.0);
    showDigit (dd);
  }
}

// show integer value without leading zero digits
void showInteger (int value) {
  bool startDisplay = false;
  float fv = float(value) / 10000.;
  for(int ni = 5; ni > 0; ni--) {
    float dd = mod(floor(fv), 10.0);
    if ((dd > 1.0)||(ni==1)) startDisplay = true;
    if (startDisplay) 
      showDigit (dd);
    fv = fv * 10.0;
  }
}
//-------------------------------------------------------------------
void main( void ) {
  vec2 aspect = resolution.xy / resolution.y;
  uv = ( gl_FragCoord.xy / resolution.y ) - aspect / 2.0;
  uv *= 30.0 + sin(time);     //  set zoom size
  vec2 mp = mouse * resolution.xy;
  ch_pos = ch_start + vec2(sin(time),8.0);  // set start position
  ch_color = vec3 (2.5 - 5.*mouse.x, 1.5-mouse.x*mouse.y, 0.5+mouse.y);
  n1 n6 mb S E G M E N T mb D I S P L A Y s_dot V n4 s_ddot nl
  tlc tb tb tb tb tb tb tb tb tb trc nl
  Lb A B C D E F G H I Rb nl
  Lb J K L M N O P Q R Rb nl
  Lb S T U V W X Y Z n0 Rb nl
  Lb n1 n2 n3 n4 n5 n6 n7 n8 n9 Rb nl
  Lb s_plus mb s_dot s_ddot lb s_less s_more s_open s_close Rb nl
  llc lb lb lb lb lb lb lb lb lb lrc s_sqrt nl
  V I E W P O R T _ I S _ showInteger(int(resolution.x)); _ s_mult _ showInteger(int(resolution.y)); nl
  R U N T I M E s_ddot showFloat(time); _ S E C O N D S nl
  M O U S E _ P O S I T I O N _ showInteger(int(mp.x)); s_mult showInteger(int (mp.y));
  ch_color = mix(ch_color, bg_color, 1.0 - (0.05 / d));  // shading
  gl_FragColor = vec4(ch_color, 1.0);
}
