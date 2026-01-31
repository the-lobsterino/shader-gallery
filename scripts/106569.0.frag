#extension GL_OES_standard_derivatives : enable

// Author: krimelz
// Title: the light interference

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265359;
const float PERIOD = PI * 10.0;

struct Wave
{
	float speed;
	float len;
	float angle;
};

vec3 hsv2rgb(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 light(float speed, float position, float len)
{
	float wave = sin(len * PERIOD * (position + time * speed));
	
	return vec3(wave) * hsv2rgb(vec3(len, 1.0, 1.0));
}

float direction(float angle, vec2 position)
{
	float rad = angle * PI / 180.0;
	
	return position.x * sin(rad) + position.y * cos(rad);
}

void main()
{
	vec2 position = vec2(
		gl_FragCoord.x / resolution.x,
		gl_FragCoord.y / resolution.y
	);
	
	Wave w1 = Wave(0.1, 1.0, 120.0);
	Wave w2 = Wave(-0.060, 0.2, 81.760);
	Wave w3 = Wave(0.132, 0.6, -40.0);
	
	w1.len = clamp(w1.len, 0.0, 1.0);
	w2.len = clamp(w2.len, 0.0, 1.0);
	w3.len = clamp(w3.len, 0.0, 1.0);
	
	vec3 light1 = light(w1.speed, direction(w1.angle, position), w1.len);
	vec3 light2 = light(w2.speed, direction(w2.angle, position), w2.len);
	vec3 light3 = light(w3.speed, direction(w3.angle, position), w3.len);

	vec4 result = vec4(light1 + light2 + light3, 1.0);
    
	gl_FragColor = result;
}

