#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rec2hex(vec2 rec)
{
	float temp = floor(rec.x + sqrt(3.0) * rec.y + 1.0);
	float q = floor((floor(2.0 * rec.x + 1.0) + temp) / 3.0);
	float r = floor((temp + floor(-rec.x + sqrt(3.0) * rec.y + 1.0)) / 3.0);
	return vec2(q,r);
}

vec3 axial_to_cube(vec2 hex)
{
	return vec3(hex.x, hex.y, -hex.x-hex.y);
}

float hex_length(vec3 hex) {
    return floor((abs(hex.x) + abs(hex.y) + abs(hex.z)) / 2.0);
}

float hex_distance(vec3 a, vec3 b) {
    return hex_length(a - b);
}

vec2 rotate(in vec2 point, in float rads)
{
	float cs = cos(rads);
	float sn = sin(rads);
	return point * mat2(cs, -sn, sn, cs);
}

void main( void )
{
	vec2 position = ((gl_FragCoord.xy / resolution.xy) * 2.0) - 1.0;
	position.y *= resolution.y/resolution.x;

	float n = 7.0;
	vec2 pos = position * n;
	
	vec2 hpos = rec2hex(pos);
	hpos = rotate(hpos, time);
	vec3 cube = axial_to_cube(hpos);
	vec3 h = abs(cube);
	float d = length(cube);
	
	vec3 color = vec3(0.0);
	
	color.rb = 1.0 - h.xz/n;
	
	color.g = 1.0 - d/n;
	
	gl_FragColor = vec4(color, 2.0);
}