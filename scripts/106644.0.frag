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
	vec2 pos;
};

vec3 hsv2rgb(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 light(Wave w)
{
	float rad = radians(w.angle);
	float dir = w.pos.x * sin(rad) + w.pos.y * cos(rad);
	float wave = sin(w.len * PERIOD * (dir + time * w.speed));
	
	return vec3(wave) * hsv2rgb(vec3(w.len, 1.0, 1.0));
}

float direction(float angle, vec2 position)
{
	float rad = angle * PI / 180.0;
	
	return position.x * sin(rad) + position.y * cos(rad);
}

bool circle(vec2 pos, float r)
{
	return pos.x * pos.x + pos.y * pos.y <= r * r;
}
		

void main()
{
	vec2 position = vec2(
		gl_FragCoord.x / resolution.x,
		gl_FragCoord.y / resolution.y
	);
	
	Wave w1 = Wave(0.01, 0.0, 0.0, vec2(0.0));
	Wave w2 = Wave(0.01, 0.4, 0.0, vec2(0.0));
	Wave w3 = Wave(0.01, 0.8, 0.0, vec2(0.0));
	
	w1.len = clamp(w1.len, 0.0, 1.0);
	w2.len = clamp(w2.len, 0.0, 1.0);
	w3.len = clamp(w3.len, 0.0, 1.0);
	
	vec3 light1 = light(w1);
	vec3 light2 = light(w2);
	vec3 light3 = light(w3);

	vec4 result = vec4(light1 + light2 + light3, 1.0);
    
	gl_FragColor = result;
}

