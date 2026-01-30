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

	gl_FragColor = vec4( c, c, 0.0, 1.0 );
}