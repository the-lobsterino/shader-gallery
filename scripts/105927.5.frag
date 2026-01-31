#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform float time;
uniform vec2 mouse,resolution;

vec3 palette(float t) { return .5+.5*cos(t*2.2-vec3(0,2,4)*smoothstep(0.,-1.,cos(t*.99)));}

//16 segment display

float dseg(vec2 p0,vec2 p1,vec2 uv)
{
	vec2 dir = normalize(p1 - p0);
	uv = (uv - p0) * mat2(dir.x, dir.y,-dir.y, dir.x);
	return distance(uv, clamp(uv, vec2(0), vec2(distance(p0, p1), 0)));   
}

bool bit(float n, float b)
{
	return mod(floor(n / exp2(floor(b))), 2.0) != 0.0;
}

float ddigit(float bits, vec2 uv)
{
	float d = 1e6;	

	float n = floor(bits);
	
	if(bits != 0.0)
	{
		d = bit(n,  0.0) ? min(d, dseg(vec2( 0.500,  0.063), vec2( 0.500,  0.937), uv)) : d;
		d = bit(n,  1.0) ? min(d, dseg(vec2( 0.438,  1.000), vec2( 0.063,  1.000), uv)) : d;
		d = bit(n,  2.0) ? min(d, dseg(vec2(-0.063,  1.000), vec2(-0.438,  1.000), uv)) : d;
		d = bit(n,  3.0) ? min(d, dseg(vec2(-0.500,  0.937), vec2(-0.500,  0.062), uv)) : d;
		d = bit(n,  4.0) ? min(d, dseg(vec2(-0.500, -0.063), vec2(-0.500, -0.938), uv)) : d;
		d = bit(n,  5.0) ? min(d, dseg(vec2(-0.438, -1.000), vec2(-0.063, -1.000), uv)) : d;
		d = bit(n,  6.0) ? min(d, dseg(vec2( 0.063, -1.000), vec2( 0.438, -1.000), uv)) : d;
		d = bit(n,  7.0) ? min(d, dseg(vec2( 0.500, -0.938), vec2( 0.500, -0.063), uv)) : d;
		d = bit(n,  8.0) ? min(d, dseg(vec2( 0.063,  0.000), vec2( 0.438, -0.000), uv)) : d;
		d = bit(n,  9.0) ? min(d, dseg(vec2( 0.063,  0.063), vec2( 0.438,  0.938), uv)) : d;
		d = bit(n, 10.0) ? min(d, dseg(vec2( 0.000,  0.063), vec2( 0.000,  0.937), uv)) : d;
		d = bit(n, 11.0) ? min(d, dseg(vec2(-0.063,  0.063), vec2(-0.438,  0.938), uv)) : d;
		d = bit(n, 12.0) ? min(d, dseg(vec2(-0.438,  0.000), vec2(-0.063, -0.000), uv)) : d;
		d = bit(n, 13.0) ? min(d, dseg(vec2(-0.063, -0.063), vec2(-0.438, -0.938), uv)) : d;
		d = bit(n, 14.0) ? min(d, dseg(vec2( 0.000, -0.938), vec2( 0.000, -0.063), uv)) : d;
		d = bit(n, 15.0) ? min(d, dseg(vec2( 0.063, -0.063), vec2( 0.438, -0.938), uv)) : d;
	}
	
	return d;
}

/*
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

15                 0
 |                 |
 0000 0000 0000 0000

example: letter A

   12    8 7  4 3210
    |    | |  | ||||
 0001 0001 1001 1111

 binary to hex -> 0x119F
 
 float c_a = float(0x119F)
*/

float a = float(0x119F);
float b = float(0x927E);
float c = float(0x007E);
float d = float(0x44E7);
float e = float(0x107E);
float f = float(0x101E);
float g = float(0x807E);
float h = float(0x1199);
float i = float(0x4466);
float j = float(0x4436);
float k = float(0x9218);
float l = float(0x0078);
float m = float(0x0A99);
float n = float(0x8899);
float o = float(0x00FF);
float p = float(0x111F);
float q = float(0x80FF);
float r = float(0x911F);
float s = float(0x8866);
float t = float(0x4406);
float u = float(0x00F9);
float v = float(0x2218);
float w = float(0xA099);
float x = float(0xAA00);
float y = float(0x4A00);
float z = float(0x2266);

const int NUM_CHARS = 2;

void main( void ) 
{
	vec2 aspect = resolution.xy / resolution.y;
	vec2 uv = ( gl_FragCoord.xy / resolution.y );
	uv -= aspect / 2.0;
	uv *= 8.0;
	
	float dist = 1e6;
	
	//Glitch fade-in animation
	float anim_time = clamp(time * 0.25, 0.0, 1.0) * 16.0;
	
	float ch[NUM_CHARS];
	
	ch[ 0] = a;
	ch[ 1] = b;
	
	//Printing and spacing
	vec2 ch_size = vec2(1.5, 2.0);
	vec2 ch_space = ch_size + vec2(0.25,0.25);
	vec2 offs = vec2(-ch_space.x * 5.5+4.,0.0);
	
	dist = min(dist, ddigit(h , uv - offs));offs.x += ch_space.x;
	dist = min(dist, ddigit(e , uv - offs));offs.x += ch_space.x;
	dist = min(dist, ddigit(l , uv - offs));offs.x += ch_space.x;
	dist = min(dist, ddigit(l , uv - offs));offs.x += ch_space.x;
	dist = min(dist, ddigit(o , uv - offs));offs.x += ch_space.x;
	
	vec3 final = vec3(0);
	vec2 nres = gl_FragCoord.xy/resolution.y*.125;
	float nres0 = length(nres);
	for (float i=0.;i<8.;i++){
		nres = fract(nres*1.6)-.5;
		final += palette(nres0+i*.4+time*.4)*.1/abs(dist+sin(dist*length(nres)/exp(nres0)*10.-time));
	}
	gl_FragColor = vec4(palette(length(exp(.5-dist)/final)),1);
}