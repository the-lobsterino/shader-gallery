// Author: krimelz
// Title: the light interference

precision highp float;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

const float PI = 3.14159265359;
const float PERIOD = PI * 100.0;

struct Wave
{
	float speed;
	float len;
	float angle;
	vec2 pos;
};

struct Circle
{
	vec2 pos;
    float r;
    float k;
};

float inside(Circle c, vec2 pos)
{
    return distance(c.pos, pos) <= c.r ? c.k : 1.0;
}

vec2 normal()
{
	return vec2(0.5);    
}

vec3 hsv2rgb(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 light(Wave w, Circle c)
{
	float rad = radians(w.angle);
	float dir = w.pos.x * sin(rad) + w.pos.y * cos(rad);
    float speed = inside(c, w.pos) * w.speed;
	float wave = sin(w.len * PERIOD * (dir + u_time * speed));
	
	return vec3(wave) * hsv2rgb(vec3(w.len, 1.0, 1.0));
}	

void main()
{
	vec2 position = vec2(
		gl_FragCoord.x / u_resolution.x,
		gl_FragCoord.y / u_resolution.y
	);
	
	Wave w1 = Wave(0.01, 0.02, 0.0, position);
	Wave w2 = Wave(0.01, 0.34, 0.0, position);
	Wave w3 = Wave(0.01, 0.68, 0.0, position);
	
	w1.len = clamp(w1.len, 0.0, 1.0);
	w2.len = clamp(w2.len, 0.0, 1.0);
	w3.len = clamp(w3.len, 0.0, 1.0);
    
    Circle c1 = Circle(vec2(0.5), 0.224, 0.732);
	
	vec3 light1 = light(w1, c1);
	vec3 light2 = light(w2, c1);
	vec3 light3 = light(w3, c1);

	vec4 result = vec4(light1 + light2 + light3, 1.0);
    
	gl_FragColor = result;
}