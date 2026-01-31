#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

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

#define OCTAVES 7
float fbm(in vec2 st, float amp) {
    // Initial values
    float value = 0.;
    float amplitude = .4+0.135/sqrt(amp);
    vec2 shift = vec2(0.1);
    mat2 rot = rotate2d(0.5);

    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st = rot*st * 2.4 + shift;

        amplitude *= 0.5201314;//云朵的那个什么
    }
    return value;
}

vec3 palette(float t) { return .5+.5*cos(t*2.2-vec3(0,2,4)*smoothstep(0.,-1.,cos(t*.99)));}

//16 segment display

float dseg(vec2 p0,vec2 p1,vec2 uv)
{
	vec2 dir = normalize(p1 - p0);
	uv = (uv - p0) * mat2(dir.x, dir.y,-dir.y, dir.x);
	return distance(uv, clamp(uv, vec2(0), vec2(distance(p0, p1), 0))) +fbm(gl_FragCoord.xy/resolution.xy+time*0.1, 0.6)/5.;   
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
	vec2 aspect = resolution.xy / resolution.y+sin(time/8.)/10.;
	vec2 uv = ( gl_FragCoord.xy / resolution.y );
	uv -= aspect / 2.0;
	uv *= 8.0;
	uv+=vec2(fbm(uv+time/4.,.5),fbm(uv.yx+time/4.,.5))/2.;
	
	float dist = 1e6;
	
	//Printing and spacing
	vec2 ch_size = vec2(1.5, 2.0);
	vec2 ch_space = ch_size + vec2(0.25,0.25);
	vec2 offs = vec2(-ch_space.x * 5.5+4.,0.0);
	
	dist = min(dist, ddigit(h , uv - offs));offs.x += ch_space.x;
	dist = min(dist, ddigit(e , uv - offs));offs.x += ch_space.x;
	dist = min(dist, ddigit(l , uv - offs));offs.x += ch_space.x;
	dist = min(dist, ddigit(l , uv - offs));offs.x += ch_space.x;
	dist = min(dist, ddigit(o , uv - offs));offs.x += ch_space.x;
	dist=sqrt(dist)/2.;
    vec2 st = gl_FragCoord.xy/resolution.xy;
    st.x *= resolution.x/resolution.y;
    vec3 color = vec3(0.0);
    //"folded" texture
    vec2 q = vec2(0.);
    q.x = fbm(gl_FragCoord.xy/resolution.xy+time*0.01, dist);
    q.y = fbm(gl_FragCoord.xy/resolution.xy+time*0.01, dist);
    // preview q
    color += vec3(q.x, 0., 0.);

    vec2 r = vec2(0.);
    r.x = fbm(st+q+time*0.05, dist);
    r.y = fbm(st+q+vec2(.4,0.7)+time*0.08, dist);
    // preview r
    color += vec3(r.x, r.y, 0.);

    float f = fbm(st+r, dist);
    //preview f
    color += vec3(q.x,0.,0.);
    color = mix(vec3(0.6, 0.5255, 0.8478),
                vec3(0.1255, 0.2784, 1.9478),
                clamp((f*f)*1.0,0.08,1.));

    color = mix(color,
                vec3(0.0157, 0.3294, 0.92667),
                clamp(length(q),0.0,1.0));
    color = mix(color,
                vec3(0.9529, 0.98529, 9.5255),
                clamp(length(r.x),0.0,1.0));	
    gl_FragColor = vec4(color,1);
}