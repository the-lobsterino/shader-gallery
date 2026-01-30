// AmigaTextScroller 
// sample code from shadertoy; 
// Modified by Gigatron Amiga Rules !   ---  Just need a Sinusscroll and a bounceing logo and you got a Amiga Cracktro
// something like this ?  :) Sinus is a bit more like : http://glslsandbox.com/e#25851.0
#ifdef GL_ES
precision mediump float;
#endif

#define _a 1
#define _b 2 
#define _c 3
#define _d 4
#define _g 7
#define _l 12
#define _n 14
#define _o 15
#define _p 16
#define _s 19
#define _t 20
#define _x 24

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float screen_ratio = resolution.y / resolution.x;

const float font_width = 3.0;
const int font_height = 5;
const int text_length = 16;
const int text2 = (_g,_l,_s,_l,0,_s,_a,_n,_d,_b,_o,_x,0,0,0,0);  // why not working with this definition ???
int text[16];

vec3 font_spc[font_height];	// 0
vec3 font_a[font_height];	// 1
vec3 font_b[font_height];	// 2
vec3 font_c[font_height];	// 3
vec3 font_d[font_height];	// 4
vec3 font_e[font_height];	// 5
vec3 font_f[font_height];	// 6
vec3 font_g[font_height];	// 7
vec3 font_h[font_height];	// 8
vec3 font_i[font_height];	// 9
vec3 font_j[font_height];	// 10
vec3 font_k[font_height];	// 11
vec3 font_l[font_height];	// 12
vec3 font_m[font_height];	// 13
vec3 font_n[font_height];	// 14
vec3 font_o[font_height];	// 15
vec3 font_p[font_height];	// 16
vec3 font_q[font_height];	// 17
vec3 font_r[font_height];	// 18
vec3 font_s[font_height];	// 19
vec3 font_t[font_height];	// 20
vec3 font_u[font_height];	// 21
vec3 font_v[font_height];	// 22
vec3 font_w[font_height];	// 23
vec3 font_x[font_height];	// 24
vec3 font_y[font_height];	// 25
vec3 font_z[font_height];	// 26

void init_text()
{
	text[0] = 7;
	text[1] = 12;
	text[2] = 19;
	text[3] = 12;
	text[4] = 0;
	text[5] = 19;
	text[6] = 1;
	text[7] = 14;
	text[8] = 4;
	text[9] = 2;
	text[10] = 15;
	text[11] = 24;
}

void init_fonts()
{
	font_spc[0] = vec3(0.0, 0.0, 0.0);
	font_spc[1] = vec3(0.0, 0.0, 0.0);
	font_spc[2] = vec3(0.0, 0.0, 0.0);
	font_spc[3] = vec3(0.0, 0.0, 0.0);
	font_spc[4] = vec3(0.0, 0.0, 0.0);

	font_a[0] = vec3(0.1, 1.0, 0.2);
	font_a[1] = vec3(1.0, 0.9, 1.0);
	font_a[2] = vec3(1.0, 1.0, 1.0);
	font_a[3] = vec3(1.0, 0.5, 1.0);
	font_a[4] = vec3(1.0, 0.0, 1.0);

	font_b[0] = vec3(1.0, 1.0, 0.0);
	font_b[1] = vec3(1.0, 0.0, 1.0);
	font_b[2] = vec3(1.0, 1.0, 1.0);
	font_b[3] = vec3(1.0, 0.0, 1.0);
	font_b[4] = vec3(1.0, 1.0, 0.0);

	font_c[0] = vec3(0.0, 1.0, 0.0);
	font_c[1] = vec3(1.0, 0.0, 1.0);
	font_c[2] = vec3(1.0, 0.0, 0.0);
	font_c[3] = vec3(1.0, 0.0, 1.0);
	font_c[4] = vec3(0.0, 1.0, 0.0);
	
	font_d[0] = vec3(1.0, 1.0, 0.0);
	font_d[1] = vec3(1.0, 0.0, 1.0);
	font_d[2] = vec3(1.0, 0.0, 1.0);
	font_d[3] = vec3(1.0, 0.0, 1.0);
	font_d[4] = vec3(1.0, 1.0, 0.0);
	
	font_e[0] = vec3(1.0, 1.0, 1.0);
	font_e[1] = vec3(1.0, 0.7, 0.0);
	font_e[2] = vec3(1.0, 1.0, 0.0);
	font_e[3] = vec3(1.0, 0.7, 0.0);
	font_e[4] = vec3(1.0, 1.0, 1.0);
	
	font_f[0] = vec3(1.0, 1.0, 1.0);
	font_f[1] = vec3(1.0, 0.0, 0.0);
	font_f[2] = vec3(1.0, 1.0, 0.0);
	font_f[3] = vec3(1.0, 0.0, 0.0);
	font_f[4] = vec3(1.0, 0.0, 0.0);
	
	font_g[0] = vec3(0.0, 1.0, 0.0);
	font_g[1] = vec3(1.0, 0.0, 1.0);
	font_g[2] = vec3(1.0, 0.0, 0.0);
	font_g[3] = vec3(1.0, 0.0, 1.0);
	font_g[4] = vec3(0.0, 1.0, 1.0);
	
	font_h[0] = vec3(1.0, 0.0, 1.0);
	font_h[1] = vec3(1.0, 0.0, 1.0);
	font_h[2] = vec3(1.0, 1.0, 1.0);
	font_h[3] = vec3(1.0, 0.0, 1.0);
	font_h[4] = vec3(1.0, 0.0, 1.0);

	font_i[0] = vec3(0.0, 1.0, 0.0);
	font_i[1] = vec3(0.0, 1.0, 0.0);
	font_i[2] = vec3(0.0, 1.0, 0.0);
	font_i[3] = vec3(0.0, 1.0, 0.0);
	font_i[4] = vec3(0.0, 1.0, 0.0);

	font_j[0] = vec3(0.0, 0.0, 1.0);
	font_j[1] = vec3(0.0, 0.0, 1.0);
	font_j[2] = vec3(0.0, 0.0, 1.0);
	font_j[3] = vec3(1.0, 0.0, 1.0);
	font_j[4] = vec3(0.0, 1.0, 0.0);
	
	font_k[0] = vec3(1.0, 0.0, 1.0);
	font_k[1] = vec3(1.0, 0.0, 1.0);
	font_k[2] = vec3(1.0, 1.0, 0.0);
	font_k[3] = vec3(1.0, 0.0, 1.0);
	font_k[4] = vec3(1.0, 0.0, 1.0);
	
	font_l[0] = vec3(1.0, 0.0, 0.0);
	font_l[1] = vec3(1.0, 0.0, 0.0);
	font_l[2] = vec3(1.0, 0.0, 0.0);
	font_l[3] = vec3(1.0, 0.0, 0.0);
	font_l[4] = vec3(1.0, 1.0, 1.0);
	
	font_m[0] = vec3(0.2, 0.6, 0.1);
	font_m[1] = vec3(1.0, 1.0, 1.0);
	font_m[2] = vec3(1.0, 0.0, 1.0);
	font_m[3] = vec3(1.0, 0.0, 1.0);
	font_m[4] = vec3(1.0, 0.0, 1.0);

	font_n[0] = vec3(1.0, 0.0, 0.0);
	font_n[1] = vec3(1.0, 1.0, 0.0);
	font_n[2] = vec3(1.0, 0.0, 1.0);
	font_n[3] = vec3(1.0, 0.0, 1.0);
	font_n[4] = vec3(1.0, 0.0, 1.0);
	
	font_o[0] = vec3(0.1, 1.0, 0.2);
	font_o[1] = vec3(1.0, 0.5, 1.0);
	font_o[2] = vec3(1.0, 0.0, 1.0);
	font_o[3] = vec3(1.0, 0.6, 1.0);
	font_o[4] = vec3(0.4, 1.0, 0.3);
	
	font_p[0] = vec3(1.0, 1.0, 0.2);
	font_p[1] = vec3(1.0, 0.9, 1.0);
	font_p[2] = vec3(1.0, 1.0, 0.3);
	font_p[3] = vec3(1.0, 0.0, 0.0);
	font_p[4] = vec3(1.0, 0.0, 0.0);

	font_q[0] = vec3(0.0, 1.0, 0.0);
	font_q[1] = vec3(1.0, 0.0, 1.0);
	font_q[2] = vec3(1.0, 0.0, 1.0);
	font_q[3] = vec3(1.0, 1.0, 0.0);
	font_q[4] = vec3(0.0, 0.0, 1.0);
	
	font_r[0] = vec3(1.0, 1.0, 0.2);
	font_r[1] = vec3(1.0, 0.9, 0.3);
	font_r[2] = vec3(1.0, 1.0, 0.7);
	font_r[3] = vec3(1.0, 0.5, 0.2);
	font_r[4] = vec3(1.0, 0.0, 1.0);
	
	font_s[0] = vec3(0.1, 1.0, 1.0);
	font_s[1] = vec3(1.0, 0.7, 0.0);
	font_s[2] = vec3(1.0, 1.0, 1.0);
	font_s[3] = vec3(0.0, 0.8, 1.0);
	font_s[4] = vec3(1.0, 1.0, 0.3);
	
	font_t[0] = vec3(1.0, 1.0, 1.0);
	font_t[1] = vec3(0.0, 1.0, 0.0);
	font_t[2] = vec3(0.0, 1.0, 0.0);
	font_t[3] = vec3(0.0, 1.0, 0.0);
	font_t[4] = vec3(0.0, 1.0, 0.0);
	
	font_u[0] = vec3(1.0, 0.0, 1.0);
	font_u[1] = vec3(1.0, 0.0, 1.0);
	font_u[2] = vec3(1.0, 0.0, 1.0);
	font_u[3] = vec3(1.0, 0.6, 1.0);
	font_u[4] = vec3(0.4, 1.0, 0.3);

	font_v[0] = vec3(1.0, 0.0, 1.0);
	font_v[1] = vec3(1.0, 0.0, 1.0);
	font_v[2] = vec3(1.0, 0.0, 1.0);
	font_v[3] = vec3(1.0, 0.0, 1.0);
	font_v[4] = vec3(0.0, 1.0, 0.0);
	
	font_w[0] = vec3(1.0, 0.0, 1.0);
	font_w[1] = vec3(1.0, 0.0, 1.0);
	font_w[2] = vec3(1.0, 0.0, 1.0);
	font_w[3] = vec3(1.0, 1.0, 1.0);
	font_w[4] = vec3(1.0, 0.5, 1.0);
	
	font_x[0] = vec3(1.0, 0.0, 1.0);
	font_x[1] = vec3(1.0, 0.0, 1.0);
	font_x[2] = vec3(0.0, 1.0, 0.0);
	font_x[3] = vec3(1.0, 0.0, 1.0);
	font_x[4] = vec3(1.0, 0.0, 1.0);

	font_y[0] = vec3(1.0, 0.0, 1.0);
	font_y[1] = vec3(1.0, 0.0, 1.0);
	font_y[2] = vec3(0.0, 1.0, 0.0);
	font_y[3] = vec3(0.0, 1.0, 0.0);
	font_y[4] = vec3(0.0, 1.0, 0.0);
	
	font_z[0] = vec3(1.0, 1.0, 1.0);
	font_z[1] = vec3(0.0, 0.0, 1.0);
	font_z[2] = vec3(0.0, 1.0, 0.0);
	font_z[3] = vec3(1.0, 0.0, 0.0);
	font_z[4] = vec3(1.0, 1.0, 1.0);
}

float draw_font_block(vec2 pixel_position, vec2 font_position, vec2 size, float tile_type)
{
	float gradient = 0.0;

	vec2 centered_font_position = font_position;

	if (abs(pixel_position.x - centered_font_position.x) <= size.x / 2.0 && 
	    abs(pixel_position.y - centered_font_position.y) <= size.y / 2.0)
	{
		if (tile_type==0.0 || tile_type==1.0)
		{
			gradient = tile_type;
		}
		else if (tile_type==0.1)
		{
			gradient = floor(2.58 - length(pixel_position - centered_font_position + vec2(-0.01, 0.01)) * 64.0);
		}
		else if (tile_type==0.2)
		{
			gradient = floor(2.58 - length(pixel_position - centered_font_position + vec2(0.01, 0.01)) * 64.0);
		}
		else if (tile_type==0.3)
		{
			gradient = floor(2.58 - length(pixel_position - centered_font_position + vec2(0.01, -0.01)) * 64.0);
		}
		else if (tile_type==0.4)
		{
			gradient = floor(2.58 - length(pixel_position - centered_font_position + vec2(-0.01, -0.01)) * 64.0);
		}
		else if (tile_type==0.5)
		{
			gradient = floor(length(pixel_position - centered_font_position) * 64.0);
			if (pixel_position.y <= centered_font_position.y) gradient = 0.0;
		}
		else if (tile_type==0.6)
		{
			gradient = floor(length(pixel_position - centered_font_position) * 64.0);
			if (pixel_position.y >= centered_font_position.y) gradient = 0.0;
		}
		else if (tile_type==0.7)
		{
			gradient = floor(length(pixel_position - centered_font_position) * 64.0);
			if (pixel_position.x >= centered_font_position.x) gradient = 0.0;
		}
		else if (tile_type==0.8)
		{
			gradient = floor(length(pixel_position - centered_font_position) * 64.0);
			if (pixel_position.x <= centered_font_position.x) gradient = 0.0;
		}
		else if (tile_type==0.9)
		{
			gradient = floor(length(pixel_position - centered_font_position) * 64.0);
		}

		if (gradient > 1.0) gradient = 1.0;
	}

	return gradient;
}

float draw_font_render(vec2 pixel_position, vec2 font_position, vec2 size, vec3 fontdata[5])
{
	float gradient = 0.0;
	font_position = (font_position - vec2(size.x * font_width, size.y * float(font_height)) / 2.0) * vec2(1.0, screen_ratio);

// for (float y=0.0; y<font_height; y++)
// {
//  for (float x=0.0; x<font_width; x++)
//  {
	gradient += draw_font_block(pixel_position, font_position + size * vec2(0.0, 4.0), size, fontdata[0].x);
	gradient += draw_font_block(pixel_position, font_position + size * vec2(1.0, 4.0), size, fontdata[0].y);
	gradient += draw_font_block(pixel_position, font_position + size * vec2(2.0, 4.0), size, fontdata[0].z);

	gradient += draw_font_block(pixel_position, font_position + size * vec2(0.0, 3.0), size, fontdata[1].x);
	gradient += draw_font_block(pixel_position, font_position + size * vec2(1.0, 3.0), size, fontdata[1].y);
	gradient += draw_font_block(pixel_position, font_position + size * vec2(2.0, 3.0), size, fontdata[1].z);

	gradient += draw_font_block(pixel_position, font_position + size * vec2(0.0, 2.0), size, fontdata[2].x);
	gradient += draw_font_block(pixel_position, font_position + size * vec2(1.0, 2.0), size, fontdata[2].y);
	gradient += draw_font_block(pixel_position, font_position + size * vec2(2.0, 2.0), size, fontdata[2].z);

	gradient += draw_font_block(pixel_position, font_position + size * vec2(0.0, 1.0), size, fontdata[3].x);
	gradient += draw_font_block(pixel_position, font_position + size * vec2(1.0, 1.0), size, fontdata[3].y);
	gradient += draw_font_block(pixel_position, font_position + size * vec2(2.0, 1.0), size, fontdata[3].z);

	gradient += draw_font_block(pixel_position, font_position + size * vec2(0.0, 0.0), size, fontdata[4].x);
	gradient += draw_font_block(pixel_position, font_position + size * vec2(1.0, 0.0), size, fontdata[4].y);
	gradient += draw_font_block(pixel_position, font_position + size * vec2(2.0, 0.0), size, fontdata[4].z);
// } }
	return gradient;
}

float draw_font(vec2 pixel_position, vec2 font_position, vec2 size, int font_number)
{
	float gradient = 0.0;
	if      (font_number==0)	gradient = draw_font_render(pixel_position, font_position, size, font_spc);
	else if (font_number==1)	gradient = draw_font_render(pixel_position, font_position, size, font_a);
	else if (font_number==2)	gradient = draw_font_render(pixel_position, font_position, size, font_b);
	else if (font_number==3)	gradient = draw_font_render(pixel_position, font_position, size, font_c);
	else if (font_number==4)	gradient = draw_font_render(pixel_position, font_position, size, font_d);
	else if (font_number==5)	gradient = draw_font_render(pixel_position, font_position, size, font_e);
	else if (font_number==6)	gradient = draw_font_render(pixel_position, font_position, size, font_f);
	else if (font_number==7)	gradient = draw_font_render(pixel_position, font_position, size, font_g);
	else if (font_number==8)	gradient = draw_font_render(pixel_position, font_position, size, font_h);
	else if (font_number==9)	gradient = draw_font_render(pixel_position, font_position, size, font_i);
	else if (font_number==10)	gradient = draw_font_render(pixel_position, font_position, size, font_j);
	else if (font_number==11)	gradient = draw_font_render(pixel_position, font_position, size, font_k);
	else if (font_number==12)	gradient = draw_font_render(pixel_position, font_position, size, font_l);
	else if (font_number==13)	gradient = draw_font_render(pixel_position, font_position, size, font_m);
	else if (font_number==14)	gradient = draw_font_render(pixel_position, font_position, size, font_n);
	else if (font_number==15)	gradient = draw_font_render(pixel_position, font_position, size, font_o);
	else if (font_number==16)	gradient = draw_font_render(pixel_position, font_position, size, font_p);
	else if (font_number==17)	gradient = draw_font_render(pixel_position, font_position, size, font_q);
	else if (font_number==18)	gradient = draw_font_render(pixel_position, font_position, size, font_r);
	else if (font_number==19)	gradient = draw_font_render(pixel_position, font_position, size, font_s);
	else if (font_number==20)	gradient = draw_font_render(pixel_position, font_position, size, font_t);
	else if (font_number==21)	gradient = draw_font_render(pixel_position, font_position, size, font_u);
	else if (font_number==22)	gradient = draw_font_render(pixel_position, font_position, size, font_v);
	else if (font_number==23)	gradient = draw_font_render(pixel_position, font_position, size, font_w);
	else if (font_number==24)	gradient = draw_font_render(pixel_position, font_position, size, font_x);
	else if (font_number==25)	gradient = draw_font_render(pixel_position, font_position, size, font_y);
	else if (font_number==26)	gradient = draw_font_render(pixel_position, font_position, size, font_z);	return gradient;
}

float draw_text(vec2 pixel_position, vec2 font_position, vec2 size)
{
	float gradient = 0.0;
	float font_size = size.x * (font_width + 1.0);
	gradient += draw_font(pixel_position, font_position + vec2(0.0, 0.0) * font_size, size, text[0]);
	gradient += draw_font(pixel_position, font_position + vec2(1.0, 0.0) * font_size, size, text[1]);
	gradient += draw_font(pixel_position, font_position + vec2(2.0, 0.0) * font_size, size, text[2]);
	gradient += draw_font(pixel_position, font_position + vec2(3.0, 0.0) * font_size, size, text[3]);
	gradient += draw_font(pixel_position, font_position + vec2(4.0, 0.0) * font_size, size, text[4]);
	gradient += draw_font(pixel_position, font_position + vec2(5.0, 0.0) * font_size, size, text[5]);
	gradient += draw_font(pixel_position, font_position + vec2(6.0, 0.0) * font_size, size, text[6]);
	gradient += draw_font(pixel_position, font_position + vec2(7.0, 0.0) * font_size, size, text[7]);
	gradient += draw_font(pixel_position, font_position + vec2(8.0, 0.0) * font_size, size, text[8]);
	gradient += draw_font(pixel_position, font_position + vec2(9.0, 0.0) * font_size, size, text[9]);
	gradient += draw_font(pixel_position, font_position + vec2(10.0, 0.0) * font_size, size, text[10]);
	gradient += draw_font(pixel_position, font_position + vec2(11.0, 0.0) * font_size, size, text[11]);
	gradient += draw_font(pixel_position, font_position + vec2(12.0, 0.0) * font_size, size, text[12]);
	gradient += draw_font(pixel_position, font_position + vec2(13.0, 0.0) * font_size, size, text[13]);
	gradient += draw_font(pixel_position, font_position + vec2(14.0, 0.0) * font_size, size, text[14]);
	gradient += draw_font(pixel_position, font_position + vec2(15.0, 0.0) * font_size, size, text[15]);
	return gradient;
}

void main()
{
    float x = gl_FragCoord.x;
    vec2 p = gl_FragCoord.xy / resolution.xy;
    vec2 c = p - vec2(0.25, 0.5);
        
    //Another amiga/atari copper fx 
    	
    float coppers = -time*5.0;
    float rep = 64.;// try 8 16 32 64 128 256 ...
    vec3 col2 = vec3(0.5 + 0.5 * sin(x/rep + 3.14 + coppers), 0.5 + 0.5 * cos (x/rep + coppers), 0.5 + 0.5 * sin (x/rep + coppers));
    vec3 col3 = vec3(0.5 + 0.5 * sin(x/rep + 3.14 - coppers), 0.5 + 0.5 * cos (x/rep -coppers), 0.5 + 0.5 * sin (x/rep - coppers));	
    init_fonts();
    init_text();

	float zoom = 0.03;// + sin(time) * 0.029;
	float sx = zoom;
	float sy = zoom;

	vec2 pixel_position = vec2(gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.x);

	float fx = 0.2;
	float fy = 0.5;
	float dispx = 1.0 - mod(0.3* time, float(text_length) * (font_width + 1.0) * sx + 1.5);
	float dispy = sin(pixel_position.x * 16.0 + 0.5 * time) * 0.025 + sin(pixel_position.x * 48.0 + 1.5 * time) * 0.0125;

	vec2 font_position = (vec2(fx, fy) + vec2(dispx, dispy));
	vec2 font_size = vec2(sx, sy);

	float gradient = draw_text(pixel_position, font_position, font_size);

	float r = 0.2 + sin(time * 2.2);
	float g = 0.3 + sin(time * 1.5);
	float b = 0.7 + sin(time + pixel_position.y * 32.0);
	vec4 font_color = vec4(vec3(r,g,b) * gradient, 1.0);	//vec3(gradient * sin(pixel_position.y * 300.0 + 16.0 * time), gradient * sin(pixel_position.y * 200.0 + 32.0 * time), gradient * sin(pixel_position.y * 100.0 + 28.0 * time)), 1.0);
	vec4 background_color = vec4(vec3(abs(pixel_position.y - 0.5 * screen_ratio)) * 0.0, 1.0);

	gl_FragColor = mix(background_color, font_color, 0.5);	
	
	if ( p.y > 0.1 && p.y < 0.106 ) gl_FragColor = vec4 ( col2, 1.0 );
	if ( p.y > 0.9 && p.y < 0.906 ) gl_FragColor = vec4 ( col3, 1.0 );
}
 