

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

const vec2 ch_size  = vec2(1.0, 3.0);              // character size
const vec2 ch_space = ch_size + vec2(0.7, 0.4);    // character distance  
const vec2 ch_start = vec2 (-ch_space.x * 12.5, 1.); // start position
      vec2 ch_pos   = vec2 (0.0, 0.0);             // character position
const vec3 ch_color = vec3(2.1, 0.6, 0.1);         // character color
const vec3 bg_color = vec3(0.0, 0.0, 0.0);         // background color
	
// 16 segment display... maybe a old school scroll text  ;-)

#define A  d = min(d, ddigit(float(0x119F), uv - ch_pos));
#define B  d = min(d, ddigit(float(0x927E), uv - ch_pos));
#define C  d = min(d, ddigit(float(0x007E), uv - ch_pos));
#define D  d = min(d, ddigit(float(0x44E7), uv - ch_pos));
#define E  d = min(d, ddigit(float(0x107E), uv - ch_pos));
#define F  d = min(d, ddigit(float(0x101E), uv - ch_pos));
#define G  d = min(d, ddigit(float(0x807E), uv - ch_pos));
#define H  d = min(d, ddigit(float(0x1199), uv - ch_pos));
#define I  d = min(d, ddigit(float(0x4466), uv - ch_pos));
#define J  d = min(d, ddigit(float(0x4436), uv - ch_pos));
#define K  d = min(d, ddigit(float(0x9218), uv - ch_pos));
#define L  d = min(d, ddigit(float(0x0078), uv - ch_pos));
#define M  d = min(d, ddigit(float(0x0A99), uv - ch_pos));
#define N  d = min(d, ddigit(float(0x8899), uv - ch_pos));
#define O  d = min(d, ddigit(float(0x00FF), uv - ch_pos));
#define P  d = min(d, ddigit(float(0x111F), uv - ch_pos));
#define Q  d = min(d, ddigit(float(0x80FF), uv - ch_pos));
#define R  d = min(d, ddigit(float(0x911F), uv - ch_pos));
#define S  d = min(d, ddigit(float(0x8866), uv - ch_pos));
#define T  d = min(d, ddigit(float(0x4406), uv - ch_pos));
#define U  d = min(d, ddigit(float(0x00F9), uv - ch_pos));
#define V  d = min(d, ddigit(float(0x2218), uv - ch_pos));
#define W  d = min(d, ddigit(float(0xA099), uv - ch_pos));
#define X  d = min(d, ddigit(float(0xAA00), uv - ch_pos));
#define Y  d = min(d, ddigit(float(0x4A00), uv - ch_pos));
#define Z  d = min(d, ddigit(float(0x2266), uv - ch_pos));
#define _ ch_pos.x += ch_space.x;
#define nl ch_pos = ch_start; ch_pos.y -= ch_space.y;

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
	ch_pos.x += ch_space.x;
	return d;
}

void main( void ) 
{
	vec2 aspect = resolution.xy / resolution.y;
	vec2 uv = ( gl_FragCoord.xy / resolution.y ) - aspect / 2.0;
	uv.y += sin(uv.x*14.0+time)*0.05;
	uv *= 30.0 + sin(time);     //  set zoom size

	float d = 1e6;
	ch_pos = ch_start;  // set start position

	T H E R E _ I S _ A _ D I S T U R B E D _ P E R S O N nl _ _ _ _ _ _ _ _ H E R E
		
	vec3 color = mix(ch_color, bg_color, 1.0- (0.08 / d));  //Shading
	
	gl_FragColor = vec4(color, 1.0);

}