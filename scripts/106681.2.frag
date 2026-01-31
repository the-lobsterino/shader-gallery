#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14;
const float PERIOD = 200.0;
const float SPEED = 1.0;

const float NONE = 0.0;
const float RED = 0.1;
const float GREEN = 0.34;
const float BLUE = 0.72;

float ratio;

float intersect(vec2 c, float r, vec2 p)
{
	return distance(c, p) <= r ? 0.1 : 1.0;
}

vec3 hsv2rgb(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 wave(vec2 c, vec2 p, float speed, vec2 shift, float len)
{
	vec2 v = p - c;
	v.x += sin(time*speed)*shift.x;
	v.y += cos(time*speed)*shift.y;
	float r = length(v);
	
	return vec3(len, 1.0, sin(r*PI*PERIOD*len-time*speed*intersect(vec2(mouse.x, mouse.y * ratio), 0.1, p)));
}

void main( void ) 
{
	ratio = resolution.y / resolution.x;
	
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p.y *= ratio;
	
	vec2 c1 = vec2(0.3, 0.3 * ratio);
	vec2 c2 = vec2(0.3, 0.7 * ratio);
	vec2 c3 = vec2(0.5, 0.5 * ratio);
	
	vec3 w1 = hsv2rgb(wave(c1, p, SPEED, vec2(0.0), RED));
	vec3 w2 = hsv2rgb(wave(c2, p, SPEED, vec2(0.0), GREEN));
	vec3 w3 = hsv2rgb(wave(c3, p, SPEED, vec2(0.0), BLUE));

	gl_FragColor = vec4((w1 + w2 + w3), 1.0);

}