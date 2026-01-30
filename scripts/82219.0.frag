#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = 3.14159265359;


float rand(float co) { return fract(sin(co*(91.3458)) * 47453.5453); }
float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }
float rand(vec3 co){ return 0.5 + 0.5 * (2.0 * rand(co.xy+rand(co.z)) - 1.0) * (2.0 * rand(co.xy+rand(co.z - 0.5)) - 1.0); }
float rand(vec4 co){ return rand(co.xyz+rand(co.w)); }

float sinease(float t) { return 0.5 + (-0.5 * cos(t * pi));}

float lerp(float a, float b, float t) { return ( 1.0 - sinease(t) ) * a + sinease(t) * b; }
float berp(float a, float b, float c, float d, float x, float y) { return lerp(lerp(a, b, x), lerp(c, d, x), y); }


void main( void ) {
	vec2 coord = gl_FragCoord.xy / vec2(60.0) - vec2(time, time / 2.0);
	float x = coord.x;
	float y = coord.y;
	
	float v00 =  rand(vec3(floor(x), floor(y), floor(time)));
	float v01 =  rand(vec3(floor(x), ceil(y), floor(time)));
	float v10 =  rand(vec3(ceil(x), floor(y), floor(time)));
	float v11 =  rand(vec3(ceil(x), ceil(y), floor(time)));
	
	float v = berp(v00, v10, v01, v11, mod(x, 1.0), mod(y, 1.0));
	
	float u00 =  rand(vec3(floor(x), floor(y), ceil(time)));
	float u01 =  rand(vec3(floor(x), ceil(y), ceil(time)));
	float u10 =  rand(vec3(ceil(x), floor(y), ceil(time)));
	float u11 =  rand(vec3(ceil(x), ceil(y), ceil(time)));
	
	float u = berp(u00, u10, u01, u11, mod(x, 1.0), mod(y, 1.0));
	
	float value = lerp(v, u, mod(time, 1.0));
	gl_FragColor = vec4(vec3(value) * 1.0, 1.0 );
	
}