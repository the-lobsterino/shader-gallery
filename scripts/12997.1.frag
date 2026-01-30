#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

// float -> float
float _plasma (float f)
{
 return sin(f * 10.0) * 0.25 + 0.25;
}

// vec2 -> float
float plasma (vec2 p)
{
 return _plasma(p.x) + _plasma(p.y);
}

// vec2 -> float
float rings(vec2 p)
{
 return sin(length(p) * 16.0);
}

// vec2 -> float -> float
float dN(vec2 v, float n)
{
 vec2 u = pow(abs(v), vec2(n));
 return pow(u.x + u.y, 1.0/n);
}

// vec2 -> float
float rings2(vec2 p)
{
 return sin(dN(p, 4.0) * 16.0);
}

// vec2 -> float
float rings3(vec2 p)
{
 float u = 4.0;
 p = mod(p * 50.0, u) - u / 2.0;
 return sin(dN(p, 4.0) * 16.0);
}

// // vec2 -> vec4
// vec4 diffuse (vec2 q)
// {
//  vec2 texPos = vec2(gl_FragCoord.xy / resolution);
//  vec2 texDelta = vec2(1.0 / resolution);
//  return texture2D(backbuffer, texPos + q * texDelta);
// }

// vec2 -> float
float rings4 (vec2 p)
{
 vec2 p2 = mod(p * 8.0, 4.0) - 2.0;
 if (p2.x > 1.0)
 {
  p2.x -= max(sin(p2.y * 5.0) * 0.3, 0.0);
 }
 if (p2.y > 1.0)
 {
  p2.y -= max(sin(p2.x * 10.0) * 0.3, 0.0);
 }
 return sin(dN(p2, 4.0) * 16.0);
}

// vec2 -> vec2
vec2 trans (vec2 p)
{
 float theta = atan(p.y, p.x);
 float r = length(p);
 return vec2(theta, 0.40/r);
}

// vec2 -> float -> vec3 -> vec4
vec4 draw_ball (vec2 q, float size, vec3 c)
{
 vec2 p = gl_FragCoord.xy / resolution.xy - 0.5;
	
 float dist = length(p - q);
 return vec4(vec3(size / dist) * c, 1.0);
}

vec4 hsv_to_rgb(float h, float s, float v, float a)
{
	float c = v * s;
	h = mod((h * 6.0), 6.0);
	float x = c * (1.0 - abs(mod(h, 2.0) - 1.0));
	vec4 color;
 
	if (0.0 <= h && h < 1.0) {
		color = vec4(c, x, 0.0, a);
	} else if (1.0 <= h && h < 2.0) {
		color = vec4(x, c, 0.0, a);
	} else if (2.0 <= h && h < 3.0) {
		color = vec4(0.0, c, x, a);
	} else if (3.0 <= h && h < 4.0) {
		color = vec4(0.0, x, c, a);
	} else if (4.0 <= h && h < 5.0) {
		color = vec4(x, 0.0, c, a);
	} else if (5.0 <= h && h < 6.0) {
		color = vec4(c, 0.0, x, a);
	} else {
		color = vec4(0.0, 0.0, 0.0, a);
	}
 
	color.rgb += v - c;
 
	return color;
}

#define pi 3.141592653589793238462643383279 

// -> t
void main ()
{
 vec2 p = gl_FragCoord.xy / resolution.xy - 0.5;

 float theta = time * 3.0;
 float a_phi = mod(time * 0.2, 1.0);
 vec3 a_color = hsv_to_rgb(a_phi, 0.7, 0.2, 1.0).xyz;
 vec4 a = draw_ball(vec2(cos(theta), sin(theta)) / 5.0, 0.009, a_color);
 float b_phi = mod(a_phi + 0.5, 1.0);
 vec3 b_color = hsv_to_rgb(b_phi, 0.7, 0.2, 1.0).xyz;
 vec4 b = draw_ball(vec2(cos(theta + pi), sin(theta + pi)) / 5.0, 0.006, b_color);
 vec4 z = texture2D(backbuffer, gl_FragCoord.xy / resolution) * 0.8;
 gl_FragColor = a + b + z;
}