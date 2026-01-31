#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Heart code Created by inigo quilez - iq/2013
//   https://www.youtube.com/c/InigoQuilez
//   https://iquilezles.org/
// I share this piece (art and code) here in Shadertoy and through its Public API, only for educational purposes. 
// You cannot use, sell, share or host this piece or modifications of it as part of your own commercial or non-commercial product, website or project.
// You can share a link to it or an unmodified screenshot of it provided you attribute "by Inigo Quilez, @iquilezles and iquilezles.org". 
// If you are a teacher, lecturer, educator or similar and these conditions are too restrictive for your needs, please contact me and we'll work it out.

// Converted to work on this site by @chaosrayne86 on Steam

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

mat2 rotate2d(float _angle){

    return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}

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

void main( void ) 
{
	vec2 aspect = resolution.xy / resolution.y;
	vec2 uv = ( gl_FragCoord.xy / resolution.y )-mouse+.5;
	uv -= aspect / 2.0;
	uv *= 6.0;
	
	float dist = 1e6;
	
	//Printing and spacing
	vec2 ch_size = vec2(1.5, 2.0);
	vec2 ch_space = ch_size + vec2(0.25,0.25);
	vec2 offs = vec2(-ch_space.x * 5.5+6.8,0.0);
	
	
	dist = min(dist, ddigit(l , uv - offs));offs.x += ch_space.x;
	dist = min(dist, ddigit(o , uv - offs));offs.x += ch_space.x;
	dist = min(dist, ddigit(v , uv - offs));offs.x += ch_space.x;
	dist = min(dist, ddigit(e , uv - offs));offs.x += ch_space.x;

    vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/min(resolution.y,resolution.x);
    if(dist<.3) p = mod(p/(max(dist,.15)+.2)*10.+33.9,2.)-1.;
	
    // background color
    vec3 bcol = vec3(1.0,0.8,0.7-0.07*p.y)*(1.0-0.25*length(p));

    // animate
    float tt = mod(time,1.5)/1.5;
    float ss = pow(tt,.2)*0.5 + 0.5;
    ss = 1.0 + ss*0.5*sin(tt*6.2831*3.0 + p.y*0.5)*exp(-tt*4.0);
    p *= vec2(0.5,1.5) + ss*vec2(0.5,-0.5);

    // shape
	p.y -= 0.25;
    float a = atan(p.x,p.y)/3.141593;
    float r = length(p);
    float h = abs(a);
    float d = (13.0*h - 22.0*h*h + 10.0*h*h*h)/(6.0-5.0*h);
    
	// color
	float s = 0.75 + 0.75*p.x;
	s *= 1.0-0.4*r;
	s = 0.3 + 0.7*s;
	s *= 0.5+0.5*pow( 1.0-clamp(r/d, 0.0, 1.0 ), 0.1 );
	vec3 hcol = vec3(1.0,0.4*r,0.3)*s;
	
    vec3 col = mix( bcol, hcol, smoothstep( -0.01, 0.01, d-r) );

    gl_FragColor = vec4(col,1.0);
}