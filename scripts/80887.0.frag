#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float snoise(vec3 uv, float res)
{
	const vec3 s = vec3(1e0, 1e2, 1e3);
	
	uv *= res;
	
	vec3 uv0 = floor(mod(uv, res))*s;
	vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;
	
	vec3 f = fract(uv); f = f*f*(3.0-2.0*f);

	vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,
		      	  uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);

	vec4 r = fract(sin(v*1e-1)*1e3);
	float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	
	r = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);
	float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	
	return mix(r0, r1, f.z)*2.-1.;
}

vec4 fire(vec2 p)
	{
    p-=vec2(.5);     
	p.x /= 1.75;
	
	float color = 3.0 - (3.*length(2.*p));
	
	vec3 coord = vec3(atan(p.x,p.y)/6.2832+.5, length(p)*.4, .5);
	
	for(int i = 1; i <= 2; i++)
		{
		float power = pow(2.0, float(i));
		color += (1.5 / power) * snoise(coord + vec3(0.,-time*.05, time*.01), power*16.);
		}
	return vec4( color, pow(max(color,0.),2.)*0.4, pow(max(color,0.),3.)*0.15 , 1.0);
	}


const vec2 ch_size  = vec2(0.9, 2.0);              	// character size
const vec2 ch_space = ch_size + vec2(0.7, 1.0);    	// character distance  
const vec2 ch_start = vec2 (-8.8, 3.0); 			// start position
      vec2 ch_pos   = vec2 (0.0, 0.0);             	// character position
float d = 1e6;

/* 16 segment display...
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


#define A_ ch_pos.x-=0.5;ddigit(0x4381,uv);ch_pos.x+=0.1;
#define B_ ch_pos.x-=0.5;ddigit(0xC442,uv);
#define V_ ch_pos.x-=0.5;ddigit(0xC642,uv);
#define G_ ch_pos.x-=0.5;ddigit(0x4402,uv);
#define D_ ch_pos.x-=0.5;ddigit(0x42C1,uv);ch_pos.x+=0.1;
//#define E_ ch_pos.x-=0.5;ddigit(0x4542,uv);
#define E_ ch_pos.x-=0.5;ddigit(0x8300,uv);
#define EY_ ch_pos.x-=0.5;ddigit(0x8300,uv);ch_pos+=vec2(.5-ch_space.x,2.5);ddigit(0x0,uv); ch_pos.x+=.5-ch_space.x; ddigit(0x0,uv); ch_pos-=vec2(1.,2.5);
//ch_pos+=vec2(1.-ch_space.x,0.);ddigit(0,uv);ch_pos-=vec2(1.,1.);

#define J_ ddigit(0xEE00,uv);
#define Z_ ch_pos.x-=0.5;ddigit(0x8242,uv);
#define I_ ddigit(0x6418,uv);ch_pos.x-=0.4;ch_pos.x+=0.1;
#define IY_ ddigit(0x6418,uv);ch_pos+=vec2(-ch_space.x,.5);ddigit(0x4,uv);ch_pos-=vec2(.5,.5);ch_pos.x+=0.1;
#define K_ ch_pos.x-=0.5;ddigit(0xc600,uv);
#define L_ ch_pos.x-=0.5;ddigit(0x4281,uv);ch_pos.x+=0.1;
#define M_ ddigit(0x0A99,uv);ch_pos.x+=0.1;
#define N_ ch_pos.x-=0.5;ddigit(0x4581,uv);ch_pos.x+=0.1;
#define O_ ch_pos.x-=0.5;ddigit(0x44c3,uv);ch_pos.x+=0.1;
#define P_ ch_pos.x-=0.5;ddigit(0x4483,uv);ch_pos.x+=0.1;
#define R_ ch_pos.x-=0.5;ddigit(0x4602,uv);
//#define S_ ch_pos.x-=0.5;ddigit(0x4442,uv);
#define S_ ch_pos.x-=0.5;ddigit(0x8200,uv);

#define T_ ddigit(0x4406, uv /* * vec2(1.2, 1.)-vec2(.5,0.)*/ );//ch_pos.x-=0.3;

#define U_ ddigit(0x3408,uv);ch_pos.x-=0.4;
#define F_ ddigit(0x550F,uv);
#define H_ ddigit(0xAA00,uv);
//#define C_ ddigit(0x4478,uv);
#define C_ ddigit(0x4478,uv);ch_pos+=vec2(.5-ch_space.x,-1.);ddigit(0x2000,uv);ch_pos-=vec2(.5,-1.);
#define CH_ ddigit(0x5408,uv);ch_pos.x-=0.4;
#define SH_ ddigit(0x44F9,uv);ch_pos.x+=0.1;
//#define SHCH_ ddigit(0x1589,uv);
#define SHCH_ ddigit(0x44F9,uv);ch_pos+=vec2(1.-ch_space.x,-1.);ddigit(0x3000,uv);ch_pos-=vec2(.5,-1.);

#define mz_ ch_pos.x-=0.5;ddigit(0xC440,uv);
#define YI_ ddigit(0x50B9,uv);ch_pos.x+=0.1;
#define tz_ ddigit(0xC44C,uv);
//#define YE_ ddigit(0x5424,uv);
#define YE_ ddigit(0x3800,uv);ch_pos.x-=0.4;

#define YU_ ddigit(0x54DB,uv);ch_pos.x+=0.1;
#define YA_ ddigit(0x740C,uv);ch_pos.x-=0.4;


#define n0 ddigit(0x22FF,uv);
#define n1 ddigit(0x0281,uv);
#define n2 ddigit(0x1177,uv);
#define n3 ddigit(0x11E7,uv);
#define n4 ddigit(0x5508,uv);
#define n5 ddigit(0x11EE,uv);
#define n6 ddigit(0x11FE,uv);
#define n7 ddigit(0x2206,uv);
#define n8 ddigit(0x11FF,uv);
#define n9 ddigit(0x11EF,uv);

#define A ddigit(0x119F,uv);
#define B ddigit(0x927E,uv);
#define C ddigit(0x007E,uv);
#define D ddigit(0x44E7,uv);
#define E ddigit(0x107E,uv);
#define F ddigit(0x101E,uv);
#define G ddigit(0x807E,uv);
#define H ddigit(0x1199,uv);
#define I ddigit(0x4466,uv);
#define J ddigit(0x4436,uv);
#define K ddigit(0x9218,uv);
#define L ddigit(0x0078,uv);
#define M ddigit(0x0A99,uv);
#define N ddigit(0x8899,uv);
#define O ddigit(0x00FF,uv);
#define P ddigit(0x111F,uv);
#define Q ddigit(0x80FF,uv);
#define R ddigit(0x911F,uv);
#define S ddigit(0x8866,uv);
#define T ddigit(0x4406,uv);
#define U ddigit(0x00F9,uv);
#define V ddigit(0x2218,uv);
#define W ddigit(0xA099,uv);
#define X ddigit(0xAA00,uv);
#define Y ddigit(0x4A00,uv);
#define Z ddigit(0x2266,uv);
#define _ ch_pos.x += ch_space.x / 1.5;

#define s_dot     ddigit(0,uv);ch_pos.x -= ch_space.x/2.;

#define s_minus   ddigit(0x1100,uv);
#define s_plus    ddigit(0x5500,uv);
#define s_greater ddigit(0x2800,uv);
#define s_less    ddigit(0x8200,uv);
#define s_sqrt    ddigit(0x0C02,uv);
#define s_exc ch_pos.y+=0.5; ddigit(0x18,uv);ch_pos+=vec2(-ch_space.x,-0.5);ddigit(0,uv);ch_pos.x-=1.;
#define s_que ch_pos.y+=0.5; ddigit(0x1414,uv);ch_pos+=vec2(-ch_space.x,-0.5);ddigit(0,uv);ch_pos.x-=.4;

#define s_sobaka ddigit(0x50F7,uv);

float dseg(vec2 p0, vec2 p1, vec2 uv)
{
	vec2 dir = normalize(p1 - p0);
	vec2 cp = (uv - ch_pos - p0) * mat2(dir.x, dir.y,-dir.y, dir.x);
	return distance(cp, clamp(cp, vec2(0), vec2(distance(p0, p1), 0)));   
}

bool bit(int n, int b)
{
	return mod(floor(float(n) / exp2(floor(float(b)))), 2.0) != 0.0;
}

void ddigit(int n, vec2 uv)
{
	float v = 1e6;	
	vec2 cp = uv - ch_pos;
	if (n == 0)     v = min(v, dseg(vec2(-0.505, -1.000), vec2(-0.500, -1.000), uv));
	if (bit(n,  0)) v = min(v, dseg(vec2( 0.500,  0.063), vec2( 0.500,  0.937), uv));
	if (bit(n,  1)) v = min(v, dseg(vec2( 0.438,  1.000), vec2( 0.063,  1.000), uv));
	if (bit(n,  2)) v = min(v, dseg(vec2(-0.063,  1.000), vec2(-0.438,  1.000), uv));
	if (bit(n,  3)) v = min(v, dseg(vec2(-0.500,  0.937), vec2(-0.500,  0.062), uv));
	if (bit(n,  4)) v = min(v, dseg(vec2(-0.500, -0.063), vec2(-0.500, -0.938), uv));
	if (bit(n,  5)) v = min(v, dseg(vec2(-0.438, -1.000), vec2(-0.063, -1.000), uv));
	if (bit(n,  6)) v = min(v, dseg(vec2( 0.063, -1.000), vec2( 0.438, -1.000), uv));
	if (bit(n,  7)) v = min(v, dseg(vec2( 0.500, -0.938), vec2( 0.500, -0.063), uv));
	if (bit(n,  8)) v = min(v, dseg(vec2( 0.063,  0.000), vec2( 0.438, -0.000), uv));
	if (bit(n,  9)) v = min(v, dseg(vec2( 0.063,  0.063), vec2( 0.438,  0.938), uv));
	if (bit(n, 10)) v = min(v, dseg(vec2( 0.000,  0.063), vec2( 0.000,  0.937), uv));
	if (bit(n, 11)) v = min(v, dseg(vec2(-0.063,  0.063), vec2(-0.438,  0.938), uv));
	if (bit(n, 12)) v = min(v, dseg(vec2(-0.438,  0.000), vec2(-0.063, -0.000), uv));
	if (bit(n, 13)) v = min(v, dseg(vec2(-0.063, -0.063), vec2(-0.438, -0.938), uv));
	if (bit(n, 14)) v = min(v, dseg(vec2( 0.000, -0.938), vec2( 0.000, -0.063), uv));
	if (bit(n, 15)) v = min(v, dseg(vec2( 0.063, -0.063), vec2( 0.438, -0.938), uv));
	ch_pos.x += ch_space.x;
	d = min(d, v);
}

void main( void ) 
{
	vec2 texcoord = ( gl_FragCoord.xy / resolution.xy );
	vec2 uv = texcoord - vec2(0.5);
	uv *= 25.0; 	
	
	ch_pos = ch_start;
	ch_pos.x += 2.0; 
	ch_pos.y += 5.0;
	YA_ _ B_ O_ G_ _ _ _ _ _ _ _ 

        ch_pos = ch_start;
	ch_pos.x += 2.0; 
	ch_pos.y += 1.0;       
        YA_ _ N_ E_ _ P_ I_ S_ A_ L_ _ 

	ch_pos = ch_start;
	ch_pos.x += 2.0;
	ch_pos.y -= 3.0;
	E_ T_ O_ _ _ 
	
	ch_pos = ch_start;
	ch_pos.x += 8.0;
	ch_pos.y -= 7.0;
	

	ch_pos = ch_start;
	ch_pos.x += 0.0;
	ch_pos.y -= 11.0;
	 

	vec3 color = mix(vec3(1.), vec3(0.), smoothstep(0.0, 0.0, d) - (0.10 / d));
	if (length(color) > 0.6)
	gl_FragColor = vec4(color, 1.0);
	else gl_FragColor = fire(texcoord);

}