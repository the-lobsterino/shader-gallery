#ifdef GL_ES
precision mediump float;
#endif

//added nice stars from http://glslsandbox.com/e#21816.0
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;
vec4 texture2D_bicubic(sampler2D tex, vec2 uv);

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
float c_period = 2.0;
float c_comma = 10.0;
float c_plus  = 1488.0;
float c_minus = 448.0;

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
float c_n = 7148.;
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


float debugPrint(vec2 p) {
	float c = 0.0;
	p += sin(p.x/20.+time*0.3+0.01*pow(time, 0.55)*p.y)*2.;
	//Mouse X position
	vec2 cpos = vec2(-28*2,0);
	if (p.y < 8.0) {
		c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_t,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_s,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_a,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_p,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_e,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_r,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_o,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_d,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_o,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_f,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_c,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_v,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_l,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_w,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_a,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_r,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_period,floor(p-cpos)); cpos.x += 4.;
	} else if (p.y < 16.0) {
		cpos = vec2(-26*2,8);
		c += Sprite3x5(c_r,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_e,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_b,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_e,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_l,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_s,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_p,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_a,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_c,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_e,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_s,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_h,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_p,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_s,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_comma,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_s,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_t,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_r,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_k,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_n,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_g,floor(p-cpos)); cpos.x += 4.;
	} else if (p.y < 24.0) {
		cpos = vec2(-28*2,16);
		c += Sprite3x5(c_f,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_r,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_o,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_m,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_a,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_h,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_d,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_d,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_e,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_n,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_b,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_a,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_s,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_e,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_comma,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_h,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_a,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_v,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_e,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_w,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_o,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_n,floor(p-cpos)); cpos.x += 4.;
	} else if (p.y < 32.0) {
		cpos = vec2(-27*2,24);
		c += Sprite3x5(c_t,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_h,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_e,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_r,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_f,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_r,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_s,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_t,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_v,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_c,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_t,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_o,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_r,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_y,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_a,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_g,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_a,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_n,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_s,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_t,floor(p-cpos)); cpos.x += 4.;
	} else if (p.y < 40.0) {
		cpos = vec2(-25*2,32);
		c += Sprite3x5(c_t,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_h,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_e,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_e,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_v,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_l,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_g,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_a,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_l,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_a,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_c,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_t,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_c,floor(p-cpos)); cpos.x += 4.;
		cpos.x += 4.;
		c += Sprite3x5(c_e,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_m,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_p,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_i,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_r,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_e,floor(p-cpos)); cpos.x += 4.;
		c += Sprite3x5(c_period,floor(p-cpos)); cpos.x += 4.;
	}	
	
	return c;
}

highp float Rand(vec2 co)
{
    highp float a = 1552.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

vec4 stars() {
	vec2 UV = gl_FragCoord.xy / resolution.xy ;
	
	vec2 TempVec2C = vec2(0.0);
	
	vec4 RetVal = vec4(0,0,0,1);	
	TempVec2C.x = Rand(vec2(UV.x, UV.y));
	TempVec2C.y = Rand(vec2(UV.y, UV.x));
	highp float PowIn = ((sin(((time+10.0)*TempVec2C.x*1.7))*0.5)+0.5); 
	RetVal.xyz = max(vec3(TempVec2C.x * pow(TempVec2C.y, 10.0) * pow(PowIn, 2.0) * 1.0), vec3(0.0));
	return RetVal;
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * normalize(mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y));
}

void main( void ) {
	vec2 p = (( gl_FragCoord.xy / resolution.xy ) - vec2(0.5, 1.0)) * vec2(96,48);
	float py = p.y;
	p.x /= -py * 0.022 + 0.2;
	p.y = -py/48.0;
	p.y = 1.0-p.y;
	p.y = -pow(p.y + 0.8, 4.0) * 10.0;
	p.y += time * 2.3;
	
	if (p.y < -8.0) {p.y = 0.0;}
	p.y = mod(p.y+6.0, 60.0);

	float c = debugPrint(p) * 1.2 * pow(-(py/48.0), 0.6);
	vec2 uv = (gl_FragCoord.xy / resolution.xy)*0.99+0.005;
	gl_FragColor = max( vec4(hsv2rgb(vec3(time*0.02, 0.9, c)), 1.0 ) + texture2D_bicubic(bb,uv+(mouse-0.5)*0.01) * (0.91 + (sin(time*0.4)*0.08)), stars() );
}

// Mitchell Netravali Reconstruction Filter {
// cubic B-spline: 
#define MNB 1.0
#define MNC 0.0

// recommended
//#define MNB 0.333333333333
//#define MNC 0.333333333333

// Catmull-Rom spline
//#define MNB 0.0
//#define MNC 0.5
// }

float MNweights(float x)
{
	float ax = abs(x);
	return (ax < 1.0) ?
		((12.0 - 9.0 * MNB - 6.0 * MNC) * ax * ax * ax +
		 (-18.0 + 12.0 * MNB + 6.0 * MNC) * ax * ax + (6.0 - 2.0 * MNB)) / 6.0
	: ((ax >= 1.0) && (ax < 2.0)) ?
		((-MNB - 6.0 * MNC) * ax * ax * ax + (6.0 * MNB + 30.0 * MNC) * ax * ax + 
		 (-12.0 * MNB - 48.0 * MNC) * ax + (8.0 * MNB + 24.0 * MNC)) / 6.0
	: 0.0;
}

vec4 texture2D_bicubic(sampler2D tex, vec2 uv)
{
	vec2 px = (3.0 / resolution);
	vec2 f = fract(uv / px);
	vec2 texel = (uv / px - f + 0.1) * px;
	vec4 weights = vec4(MNweights(1.0 + f.x),
			    MNweights(f.x),
			    MNweights(1.0 - f.x),
			    MNweights(2.0 - f.x));
	vec4 t1 = 
		texture2D(tex, texel + vec2(-px.x, -px.y)) * weights.x +
		texture2D(tex, texel + vec2(0.0, -px.y)) * weights.y +
		texture2D(tex, texel + vec2(px.x, -px.y)) * weights.z +
		texture2D(tex, texel + vec2(2.0 * px.x, -px.y)) * weights.w;
	vec4 t2 = 
		texture2D(tex, texel + vec2(-px.x, 0.0)) * weights.x +
		texture2D(tex, texel) /* + vec2(0.0) */ * weights.y +
		texture2D(tex, texel + vec2(px.x, 0.0)) * weights.z +
		texture2D(tex, texel + vec2(2.0 * px.x, 0.0)) * weights.w;
	vec4 t3 = 
		texture2D(tex, texel + vec2(-px.x, px.y)) * weights.x +
		texture2D(tex, texel + vec2(0.0, px.y)) * weights.y +
		texture2D(tex, texel + vec2(px.x, px.y)) * weights.z +
		texture2D(tex, texel + vec2(2.0 * px.x, px.y)) * weights.w;
	vec4 t4 = 
		texture2D(tex, texel + vec2(-px.x, 2.0 * px.y)) * weights.x +
		texture2D(tex, texel + vec2(0.0, 2.0 * px.y)) * weights.y +
		texture2D(tex, texel + vec2(px.x, 2.0 * px.y)) * weights.z +
		texture2D(tex, texel + vec2(2.0 * px.x, 2.0 * px.y)) * weights.w;
	
	return MNweights(1.0 + f.y) * t1 +
		MNweights(f.y) * t2 +
		MNweights(1.0 - f.y) * t3 +
		MNweights(2.0 - f.y) * t4;
}
