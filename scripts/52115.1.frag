
//
// My own contribution to the glsl sandbox political war.
// Hope you like it! ^w^
//
// Most of this code wouldn't be possible without
// the book "Book of Shader":
// 	https://thebookofshaders.com/
// Very recomended for shader fans.
//
// I don't know what the comment below means
// But I still copied it as a tradition (I guess).


// SixteenSegmentDisplay.glsl
// 16 Segment Display Example v3
// rearranged source code by I.G.P.
// better comments added to source by Hekate

// ↙
//  ↙
//   ↙
// https://goo.gl/LGNRTH

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform float time;
uniform vec2 resolution;


// ---------------------------------------------------------------------------------------- //
//  --------------------------- From here everything is copy pasted ----------------------  //
// ---------------------------------------------------------------------------------------- //
vec2 uv;

const vec2 ch_size  = vec2(1.0, 1.0);              // character size (X,Y)
const vec2 ch_space = ch_size + vec2(2.0, 1.0);    // character distance Vector(X,Y)
const vec2 ch_start = vec2 (ch_space.x * 1., 18.); // start position
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
#define nl5 ch_pos = ch_start; ch_pos.y -= 15.0; //My own line

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
	ch_pos.x += ch_space.x;
	d = min(d, v);
}

// ---------------------------------------------------------------------------------------- //
// ---------------------------------------------------------------------------------------- //
// ---------------------------------------------------------------------------------------- //



//Taken from https://gist.github.com/companje/29408948f1e8be54dd5733a74ca49bb9
float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

//For 2d rotation
//Taken from book of shaders
mat2 rotate2d (float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

//For creating regular polygons
//Taken from book of shaders
float edgePolygon (vec2 st, float s, int n) {
    vec3 color = vec3(0.0);
    float d = 0.0;
    // Remap the space to -1. to 1.
    //st -= pos;
    st *= s;
    // Angle and radius from the current pixel
    float a = atan(st.x,st.y)+PI;
    float r = TWO_PI/float(n);

    // Shaping function that modulate the distance
    d = cos(floor(.5+a/r)*r-a)*length(st);

    return 1.0-smoothstep(.4,.41,d);
}

//Creates a 5 point stars
float getStar (vec2 st, vec2 pos, float s) {
    float value;
    {
        vec2 rst = st;
        //rst -= vec2(.5, .5);
	rst -= pos;
        rst *= rotate2d(PI);
        rst *= s;
    	value += edgePolygon(rst, 2.0, 5);
    }
    for (float i = 0.; i < 5.; i++) {
        float r = i / 5.;
        vec2 rst = st;
        //rst -= vec2(0.5,0.5);
	rst -= pos;
	rst *= rotate2d(i / 5.0 * TWO_PI);
	rst *= s;
	rst -= vec2(0.0, 0.3);
        
    	value += edgePolygon(rst, 2.0, 3);
    };
    return value;
}


//For diagonal lines
//Taken from book of shaders
float plot(in vec2 st, in float pct,in float width){
  return  smoothstep( pct - width, pct, st.y) -
          smoothstep( pct, pct + width, st.y);
}

//Secant function
float sec (in float x) {
	return 1.0 / cos(x);
}

//Self explanatory
vec3 getTrueGayPrideFlag (in vec2 st) {
	
	vec2 relativepos = st;
	
	float a;
	{
		float width = 0.2;
		float l1 = plot(st, st.x, width);
		l1 = min(l1, 0.25) * 4.0;
		st.x = 1.0 - st.x;
		float l2 = plot(st, st.x, width);
		l2 = min(l2, 0.25) * 4.0;
		a = min(l1 + l2, 1.0);
	}
	
	
	float b;
	{
		float width = 0.1;
		float l1 = plot(st, st.x, width);
		l1 = min(l1, 0.25) * 4.0;
		st.x = 1.0 - st.x;
		float l2 = plot(st, st.x, width);
		l2 = min(l2, 0.25) * 4.0;
		b = min(l1 + l2, 1.0);
	}
	
	float c;
	{
		vec2 rst = st;
		//rst.x *= resolution.x / resolution.y;
		vec2 pos;
		for (float i = 0. ; i < 14.; i++) {
			float mi = mod(i , 7.);
			if (mi != 3.) {
				float y = ((i >= 7.) ?
					   (1.0 - 1.0 / 7.0 * mi -0.5 / 7.0) : 
					   (.5 / 7.0) + 1.0 / 7.0 * mi);
				pos = vec2( 1.0 / 7.0 * mi + 0.5 / 7.0, y);
				c += getStar(rst, pos, 18.0);
			}
		}
	}
	c = min(c * 2.0, 1.0);
	
	float d = getStar(st, vec2(.5), 18.0);
	d = min(d * 8.0, 1.0);
	
	float red = 1.0 - a - b + c;
	float green = a - b + c + d;
	float blue = a;
	
	return vec3(red, green, blue);
	
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	position *= rotate2d(sin(time) / 4.0);
	
	//For the flag
	vec2 rpos = position * 1.5;
	rpos -= vec2(.25, .25);
	vec3 color = getTrueGayPrideFlag(rpos);
	
	color.r  = map(color.r, 0., 1., 0.7, 0.9);
	color.g  = map(color.g, 0., 1., 0.1, 0.9);
	color.b  = map(color.b, 0., 1., 0.6, 0.95);
	
	float sflgx = abs(rpos.x - .5); //Smooth flag x
	float sflgy = abs(rpos.y - .5); //Smooth flag y
	color /= smoothstep(sflgx-.02, sflgx+.02, .5);
	color /= smoothstep(sflgy-.02, sflgy+.02, .5);
	
	
	
	//For the letters
	uv = position;
	uv.x *= 40.0 + sin(time) * tan(time * 2.);     //  set zoom size
	uv.y *= 20.0 + cos(time * 2.) * tan(time);     //  set zoom size
	
	ch_pos = ch_start + vec2(sin(time),0.0);  // set start position

        A _ P R O U D _ R E B E L _ nl5 H A Z Z A R D _ C O U N T Y 
	//E N W A R D _ nl5 _ B R O W N
	
	float let = step(1.0 - d, 0.8);
	let = max(min(let, 1.0), 0.0);
	if (let < 0.2)
		color = vec3(1.0, 0.75, 0.8) / 1.5;
	
	gl_FragColor = vec4( color, 1.0 );
}