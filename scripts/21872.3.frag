#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//3x5 digit sprites stored in "15 bit" numbers
/*
███     111
  █     001
███  -> 111  -> 111001111100111 -> 29671
█       100
███     111
*/
/*
        000
        000
     -> 000  -> 000000000000010 -> 2
        000
 █      010
*/
/*
        000
 █      010
███  -> 111  -> 000010111010000 -> 1488
 █      010
        000
*/
/*
        000
        000
███  -> 111  -> 000000111000000 -> 448
        000
        000
*/

float c_0 = 31599.0;
float c_1 = 9362.0;
float c_2 = 29671.0;
float c_3 = 29391.0;
float c_4 = 23497.0;
float c_5 = 31183.0;
float c_6 = 31215.0;
float c_7 = 29257.0;
float c_8 = 31727.0;
float c_9 = 31695.0;

float c_colon = 1040.0;
float c_scolon = 1044.0;
float c_period = 2.0;
float c_comma = 10.0;
float c_exclam = 9346.0;
float c_apostrophe = 5120.0;

float c_plus  = 1488.0;
float c_minus = 448.0;
float c_lparen = 5265.0;
float c_rparen = 17556.0;
float c_lbrack = 13587.0;
float c_rbrack = 25686.0;
float c_undersc = 7.0;
float c_equal = 3640.0;

float c_a = 31725.;
float c_b = 31663.;
float c_c = 31015.;
float c_d = 27502.;
float c_e = 31143.;
float c_f = 31140.;
float c_g = 31087.;
float c_h = 23533.;
float c_i = 29847.;
float c_j = 4719.;
float c_k = 23469.;
float c_l = 18727.;
float c_m = 24429.;
float c_n = 27501.;
float c_o = 31599.;
float c_p = 31716.;
float c_q = 31609.;
float c_r = 27565.;
float c_s = 31183.;
float c_t = 29842.;
float c_u = 23407.;
float c_v = 23402.;
float c_w = 23421.;
float c_x = 23213.;
float c_y = 23186.;
float c_z = 29351.;

const float lineOffset = -64.0;
const float charWidth = 4.0;
const float charHeight = 8.0;
const float lineWidth = 32.0;

#define NL cpos.x = lineOffset; cpos.y += charHeight;

#define _ cpos.x += advance;
#define CM c += Sprite3x5(c_comma,floor(p-cpos)); cpos.x += advance;
#define AP c += Sprite3x5(c_apostrophe,floor(p-cpos)); cpos.x += advance;
#define PE c += Sprite3x5(c_period,floor(p-cpos)); cpos.x += advance;
#define EX c += Sprite3x5(c_exclam,floor(p-cpos)); cpos.x += advance;
#define LP c += Sprite3x5(c_lparen,floor(p-cpos)); cpos.x += advance;
#define RP c += Sprite3x5(c_rparen,floor(p-cpos)); cpos.x += advance;
#define LB c += Sprite3x5(c_lbrack,floor(p-cpos)); cpos.x += advance;
#define RB c += Sprite3x5(c_rbrack,floor(p-cpos)); cpos.x += advance;
#define RB c += Sprite3x5(c_rbrack,floor(p-cpos)); cpos.x += advance;
#define US c += Sprite3x5(c_undersc,floor(p-cpos)); cpos.x += advance;
#define EQ c += Sprite3x5(c_equal,floor(p-cpos)); cpos.x += advance;
#define CO c += Sprite3x5(c_colon,floor(p-cpos)); cpos.x += advance;
#define SC c += Sprite3x5(c_scolon,floor(p-cpos)); cpos.x += advance;

#define A c += Sprite3x5(c_a,floor(p-cpos)); cpos.x += advance;
#define B c += Sprite3x5(c_b,floor(p-cpos)); cpos.x += advance;
#define C c += Sprite3x5(c_c,floor(p-cpos)); cpos.x += advance;
#define D c += Sprite3x5(c_d,floor(p-cpos)); cpos.x += advance;
#define E c += Sprite3x5(c_e,floor(p-cpos)); cpos.x += advance;
#define F c += Sprite3x5(c_f,floor(p-cpos)); cpos.x += advance;
#define G c += Sprite3x5(c_g,floor(p-cpos)); cpos.x += advance;
#define H c += Sprite3x5(c_h,floor(p-cpos)); cpos.x += advance;
#define I c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += advance;
#define J c += Sprite3x5(c_j,floor(p-cpos)); cpos.x += advance;
#define K c += Sprite3x5(c_k,floor(p-cpos)); cpos.x += advance;
#define L c += Sprite3x5(c_l,floor(p-cpos)); cpos.x += advance;
#define M c += Sprite3x5(c_m,floor(p-cpos)); cpos.x += advance;
#define N c += Sprite3x5(c_n,floor(p-cpos)); cpos.x += advance;
#define O c += Sprite3x5(c_o,floor(p-cpos)); cpos.x += advance;
#define P c += Sprite3x5(c_p,floor(p-cpos)); cpos.x += advance;
#define Q c += Sprite3x5(c_q,floor(p-cpos)); cpos.x += advance;
#define R c += Sprite3x5(c_r,floor(p-cpos)); cpos.x += advance;
#define S c += Sprite3x5(c_s,floor(p-cpos)); cpos.x += advance;
#define T c += Sprite3x5(c_t,floor(p-cpos)); cpos.x += advance;
#define U c += Sprite3x5(c_u,floor(p-cpos)); cpos.x += advance;
#define V c += Sprite3x5(c_v,floor(p-cpos)); cpos.x += advance;
#define W c += Sprite3x5(c_w,floor(p-cpos)); cpos.x += advance;
#define X c += Sprite3x5(c_x,floor(p-cpos)); cpos.x += advance;
#define Y c += Sprite3x5(c_y,floor(p-cpos)); cpos.x += advance;
#define Z c += Sprite3x5(c_z,floor(p-cpos)); cpos.x += advance;

#define _0 c += Sprite3x5(c_0,floor(p-cpos)); cpos.x += advance;
#define _1 c += Sprite3x5(c_1,floor(p-cpos)); cpos.x += advance;
#define _2 c += Sprite3x5(c_2,floor(p-cpos)); cpos.x += advance;
#define _3 c += Sprite3x5(c_3,floor(p-cpos)); cpos.x += advance;
#define _4 c += Sprite3x5(c_4,floor(p-cpos)); cpos.x += advance;
#define _5 c += Sprite3x5(c_5,floor(p-cpos)); cpos.x += advance;
#define _6 c += Sprite3x5(c_6,floor(p-cpos)); cpos.x += advance;
#define _7 c += Sprite3x5(c_7,floor(p-cpos)); cpos.x += advance;
#define _8 c += Sprite3x5(c_8,floor(p-cpos)); cpos.x += advance;
#define _9 c += Sprite3x5(c_9,floor(p-cpos)); cpos.x += advance;

	
//returns 0/1 based on the state of the given bit in the given number
float getBit(float num,float bit)
{
	num = floor(num);
	bit = floor(bit);
	
	return float(mod(floor(num/pow(2.,bit)),2.) == 1.0);
}

float Sprite3x5(float sprite,vec2 p)
{
	p.y = 4.0-p.y;
	float bounds = float(all(lessThan(p,vec2(3,5))) && all(greaterThanEqual(p,vec2(0,0))));
	
	return getBit(sprite,(2.0 - p.x) + 3.0 * p.y) * bounds;
}


float debugPrint(vec2 pos) {
	float c = 0.0;
	vec2 p = pos;
	//Mouse X position
	vec2 cpos = vec2(lineOffset,0);
	
	float advance = charWidth * (lineWidth / 34.); // based on number of chars in upcoming line, as float
	I T _ I S _ A _ P E R I O D _ O F _ C I V I L _ W A R PE _ R E B E L NL
	S P A C E S H I P S CM _ S T R I K I N G _ F R O M _ A _ H I D D E N NL
	B A S E  CM _ H A V E _ W O N _ T H E I R _ F I R S T _ V I C T O R Y NL
	advance = charWidth * (lineWidth / 33.);
	A G A I N S T _ T H E _ E V I L _ G A L A C T I C _ E M P I R E PE NL
	NL

	advance = charWidth * (lineWidth / 38.);
	D U R I N G _ T H E _ B A T T L E CM _ R E B E L _ S P I E S _ M A N A G E D NL
	advance = charWidth * (lineWidth / 37.);
	T O _ S T E A L _ S E C R E T _ P L A N S _ T O _ T H E _ E M P I R E AP S NL
	advance = charWidth * (lineWidth / 35.);
	U L T I M A T E _ W E A P O N CM _ T H E _ 
	p.y = p.y * 0.75 + 15.; // for emphasis ;)
	D E A T H _ S T A R
	p = pos;
	CM _ A N NL
	advance = charWidth * (lineWidth / 33.);
	A R M O R E D _ S P A C E _ S T A T I O N _ W I T H _ E N O U G H NL
	advance = charWidth * (lineWidth / 34.);
	P O W E R _ T O _ D E S T R O Y _ A N _ E N T I R E _ P L A N E T PE NL
	NL
	
	advance = charWidth * (lineWidth / 40.);
	P U R S U E D _ B Y _ T H E _ E M P I R E AP S _ S I N I S T E R _ A G E N T S CM NL
	advance = charWidth * (lineWidth / 35.);
	P R I N C E S S _ L E I A _ R A C E S _ H O M E _ A B O A R D _ H E R NL
	advance = charWidth * (lineWidth / 39.);
	S T A R S H I P CM _ C U S T O D I A N _ O F _ T H E _ S T O L E N _ P L A N S NL
	advance = charWidth * (lineWidth / 36.);
	T H A T _ C A N _ S A V E _ H E R _ P E O P L E _ A N D _ R E S T O R E NL
	advance = charWidth;
	F R E E D O M _ T O _ T H E _ G A L A X Y PE PE PE PE NL	
	return c;
}

float Rand(vec2 co)
{
    float a = 1552.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt= dot(co.xy ,vec2(a,b));
    float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

vec4 stars() {
	vec2 UV = gl_FragCoord.xy / resolution.xy ;
	
	vec2 TempVec2C = vec2(Rand(vec2(UV.x, UV.y)), Rand(vec2(UV.y, UV.x)));
	return vec4(max(vec3(TempVec2C.x * pow(TempVec2C.y, 300.0)), vec3(0.0)), 1.0);
}

void main( void ) {
	vec2 p = (( gl_FragCoord.xy / resolution.xy ) - vec2(0.5, 1.0)) * vec2(256,128);
	float py = p.y;
	p.x /= -py * 0.012 + 0.4;
	p.y = -py/128.0;
	p.y = 1.0-p.y;
	p.y = -pow(p.y + 0.8, 4.0) * 20.0;
	p.y += time * 2.3;
	
	if (p.y < -8.0) {p.y = 0.0;}
	p.y = mod(p.y+6.0, 320.0);

	float c = debugPrint(p) * 1.2 * pow(-(py/128.0), 0.6);

	gl_FragColor = max(vec4( c, c*0.7, 0.0, 1.0 ), stars());
}