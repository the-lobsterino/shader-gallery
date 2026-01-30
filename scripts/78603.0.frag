#ifdef GL_ES
precision highp float;
#endif

// ↙
//  ↙
//   ↙
// https://youtu.be/dQw4w9WgXcQ

// compare algorithm performance, comment out line below to see previous performance:
#define ANOTHER_ALGORITHM      // runs slower on ARM, so comment this out if mobile phone performance is priority

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

// split 16 Bit int into two 8 Bit int for mobile phones with ridiculous 1-byte int
#define n0 ddigit(0x22,0xFF);
#define n1 ddigit(0x02,0x81);
#define n2 ddigit(0x11,0x77);
#define n3 ddigit(0x11,0xE7);
#define n4 ddigit(0x55,0x08);
#define n5 ddigit(0x11,0xEE);
#define n6 ddigit(0x11,0xFE);
#define n7 ddigit(0x22,0x06);
#define n8 ddigit(0x11,0xFF);
#define n9 ddigit(0x11,0xEF);

#define A ddigit(0x11,0x9F);
#define B ddigit(0x92,0x7E);
#define C ddigit(0x00,0x7E);
#define D ddigit(0x44,0xE7);
#define E ddigit(0x10,0x7E);
#define F ddigit(0x10,0x1E);
#define G ddigit(0x80,0x7E);
#define H ddigit(0x11,0x99);
#define I ddigit(0x44,0x66);
#define J ddigit(0x44,0x36);
#define K ddigit(0x92,0x18);
#define L ddigit(0x00,0x78);
#define M ddigit(0x0A,0x99);
#define N ddigit(0x88,0x99);
#define O ddigit(0x00,0xFF);
#define P ddigit(0x11,0x1F);
#define Q ddigit(0x80,0xFF);
#define R ddigit(0x91,0x1F);
#define S ddigit(0x88,0x66);
#define T ddigit(0x44,0x06);
#define U ddigit(0x00,0xF9);
#define u ddigit(0x00,0xF0);
#define V ddigit(0x22,0x18);
#define W ddigit(0xA0,0x99);
#define w ddigit(0xA0,0x90);
#define X ddigit(0xAA,0x00);
#define Y ddigit(0x4A,0x00);
#define Z ddigit(0x22,0x66);
#define _ ch_pos.x += ch_space.x;
#define s_dot     ddigit(0,0);
#define s_minus   ddigit(0x11,0x00);
#define s_plus    ddigit(0x55,0x00);
#define s_greater ddigit(0x28,0x00);
#define s_less    ddigit(0x82,0x00);
#define s_sqrt    ddigit(0x0C,0x02);
#define s_sw      ddigit(0x55,0xAA);
#define s_pow     ddigit(0x02,0x01);
#define upper_u   ddigit(0x11,0x09);
#define s_bra    ddigit(0x00,0x3C);
#define s_ket    ddigit(0x00,0xC3);
#define s_quotl    ddigit(0x04,0x01);
#define s_quotr    ddigit(0x04,0x08);
#define s_degrees    ddigit(0x05,0x03);
#define s_ast    ddigit(0xFF,0x00);
#define s_question ch_pos-=vec2(-.45,.4); ddigit(0,0); ch_pos+=vec2(-ch_space.x-.45,.4); ddigit(0x41,0x07); 
#define s_exclam   ch_pos-=vec2(-.45,.4); ddigit(0,0); ch_pos+=vec2(-ch_space.x-.45,.4); ddigit(0x44,0x00);
#define s_comma   ch_pos-=vec2(.45); ddigit(0x20,0x00); ch_pos+=vec2(.45);
#define nl1 ch_pos = ch_start;  ch_pos.y -= 3.0;
#define nl2 ch_pos = ch_start;  ch_pos.y -= 6.0;
#define nl3 ch_pos = ch_start;	ch_pos.y -= 9.0;

#ifdef ANOTHER_ALGORITHM
float dseg1(vec2 p0, vec2 p1)
{
	vec2 cp = vec2(uv.x-(uv.y*.5-ch_pos.y*.5-p0.y), uv.y) - ch_pos - p0;
	return distance(cp, vec2(0., clamp(cp.y, 0., p1.y-p0.y)) );   
}
float dseg2(vec2 p0, vec2 p1)
{
	vec2 cp = vec2(uv.x+(uv.y*.5-.9-ch_pos.y*.5-p0.y), uv.y) - ch_pos - p0;
	return distance(cp, vec2(0., clamp(cp.y, 0., p1.y-p0.y)) );   
}
#else
float dseg(vec2 p0, vec2 p1)
{
	vec2 dir = normalize(p1 - p0);
	vec2 cp = (uv - ch_pos - p0) * mat2(dir.x, dir.y,-dir.y, dir.x);
	return distance(cp, clamp(cp, vec2(0), vec2(distance(p0, p1), 0)));   
}
#endif
float dsegH(vec2 p0, vec2 p1) // avoiding matric ops
{
	vec2 cp = uv - ch_pos - p0;
	//return distance(cp, clamp(cp, vec2(0), vec2(distance(p0, p1), 0)));   
	return distance(cp, vec2(clamp(cp.x, 0., p1.x-p0.x), 0.) );   
}
float dsegV(vec2 p0, vec2 p1) // avoiding matrix ops
{
	vec2 cp = uv - ch_pos - p0;
	//return distance(cp, clamp(cp, vec2(0), vec2(0, distance(p0, p1))));   
	return distance(cp, vec2(0., clamp(cp.y, 0., p1.y-p0.y)) );   
}

bool bit(int n)
{
	return (n/2)*2 != n;  
}

float d = 1e6;

#ifdef ANOTHER_ALGORITHM		// Intel skylake GPU seems to prefer this 
void ddigit(int n, int nn)
{
	float v = 1e6;	
	vec2 cp = uv - ch_pos;
	// better performance in this order, on Intel Iris 550 skylake  (WHY does order matter??)
	if (n == 0 && nn==0)     v = min(v, dsegH(vec2(-0.405, -1.000), vec2(-0.500, -1.000)));
	if (bit(nn/4)) v = min(v, dsegH(vec2( -0.438,  1.000), vec2(-0.063, 1.000)));
	if (bit(nn/2)) v = min(v, dsegH(vec2(0.063,  1.000), vec2(0.438,  1.000)));
	if (bit(nn/32)) v = min(v, dsegH(vec2(-0.438, -1.000), vec2(-0.063, -1.000)));
	if (bit(nn/64)) v = min(v, dsegH(vec2( 0.063, -1.000), vec2( 0.438, -1.000)));
	if (bit(n/1)) v = min(v, dsegH(vec2( 0.063,  0.000), vec2( 0.438, -0.000)));
	if (bit(n/16)) v = min(v, dsegH(vec2(-0.438,  0.000), vec2(-0.063, -0.000)));
	if (bit(nn/1)) v = min(v, dsegV(vec2( 0.500,  0.063), vec2( 0.500,  0.937)));
	if (bit(nn/128)) v = min(v, dsegV(vec2( 0.500, -0.938), vec2( 0.500, -0.063)));
	if (bit(n/4)) v = min(v, dsegV(vec2( 0.000,  0.063), vec2( 0.000,  0.937)));
	if (bit(n/64)) v = min(v, dsegV(vec2( 0.000, -0.938), vec2( 0.000, -0.063)));	
	if (bit(nn/8)) v = min(v, dsegV(vec2(-0.500,  0.063), vec2(-0.500,  0.937)));
	if (bit(nn/16)) v = min(v, dsegV(vec2(-0.500, -0.938), vec2(-0.500, -0.063)));
	// matrix ops last
	if (bit(n/2)) v = min(v, dseg1(vec2( 0.063,  0.063), vec2( 0.063,  0.938)));
	if (bit(n/8)) v = min(v, dseg2(vec2(-0.963,  0.063), vec2(-1.338,  0.938)));
	if (bit(n/32)) v = min(v, dseg1(vec2(-0.963, -0.938), vec2(-0.963, -0.063)));
	if (bit(n/128)) v = min(v, dseg2(vec2( 0.063, -0.938), vec2( 0.063, -0.063)));
	ch_pos.x += ch_space.x;
	d = min(d, v);
}
#else		// some GPU's may run faster with this
void ddigit(int n, int nn)
{
	float v = 1e6;	
	vec2 cp = uv - ch_pos;
	if (n == 0 && nn == 0)     v = min(v, dseg(vec2(-0.405, -1.000), vec2(-0.500, -1.000)));
	if (bit(nn/1)) v = min(v, dseg(vec2( 0.500,  0.063), vec2( 0.500,  0.937)));
	if (bit(nn/2)) v = min(v, dseg(vec2( 0.438,  1.000), vec2( 0.063,  1.000)));
	if (bit(nn/4)) v = min(v, dseg(vec2(-0.063,  1.000), vec2(-0.438,  1.000)));
	if (bit(nn/8)) v = min(v, dseg(vec2(-0.500,  0.937), vec2(-0.500,  0.062)));
	if (bit(nn/16)) v = min(v, dseg(vec2(-0.500, -0.063), vec2(-0.500, -0.938)));
	if (bit(nn/32)) v = min(v, dseg(vec2(-0.438, -1.000), vec2(-0.063, -1.000)));
	if (bit(nn/64)) v = min(v, dseg(vec2( 0.063, -1.000), vec2( 0.438, -1.000)));
	if (bit(nn/128)) v = min(v, dseg(vec2( 0.500, -0.938), vec2( 0.500, -0.063)));
	if (bit(n/1)) v = min(v, dseg(vec2( 0.063,  0.000), vec2( 0.438, -0.000)));
	if (bit(n/2)) v = min(v, dseg(vec2( 0.063,  0.063), vec2( 0.438,  0.938)));
	if (bit(n/4)) v = min(v, dseg(vec2( 0.000,  0.063), vec2( 0.000,  0.937)));
	if (bit(n/8)) v = min(v, dseg(vec2(-0.063,  0.063), vec2(-0.438,  0.938)));
	if (bit(n/16)) v = min(v, dseg(vec2(-0.438,  0.000), vec2(-0.063, -0.000)));
	if (bit(n/32)) v = min(v, dseg(vec2(-0.063, -0.063), vec2(-0.438, -0.938)));
	if (bit(n/64)) v = min(v, dseg(vec2( 0.000, -0.938), vec2( 0.000, -0.063)));
	if (bit(n/128)) v = min(v, dseg(vec2( 0.063, -0.063), vec2( 0.438, -0.938)));
	ch_pos.x += ch_space.x;
	d = min(d, v);
}
#endif

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
void main( void ) 
{
	
	vec2 aspect = resolution.xy / resolution.y;
	uv = ( gl_FragCoord.xy / resolution.y ) - aspect / 2.0;
	float _d =  1.0-length(uv);
	uv *= 24.0 ;
	uv -= vec2(-10., 4.);
	//uv *= rotate(time+uv.x*0.05);

	vec3 ch_color = hsv2rgb_smooth(vec3(time*0.4+uv.y*0.1,0.5,1.0));

	vec3 bg_color = vec3(_d*0.4, _d*0.2, _d*0.1);
	uv.x += 0.5+sin(time+uv.y*0.7)*0.5;
	uv.x+=3.;
	ch_pos = ch_start;


	          P I N G A S S
			   
		
                 
                 
		
	vec3 color = mix(ch_color, bg_color, 1.0- (0.08 / d*2.0));  // shading
	gl_FragColor = vec4(color, 1.0);
}