#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

// For aperture
#define f 0.1
#define MAX_RAY_REFLECTIONS	4
#define SAMPLES			16
#define PI 3.14159265359

/*
*************************************************
*               RANDOM FUNCTIONS                *
*************************************************
*/

float hash32(float index) {
	float n = 1000000.0 / (mod(index, 2459.0) + 1.0);
	
	n = floor(n) / (fract(n) + 1.0);
	
	n *= 58302.0;
	n = mod(n, 2995.0);
	n *= 0.5;
	n /= mod(n * 0.042 + 1.0, 10.0);
	n *= 65536.0;
	n = mod(n, 255.0);
	n /= 4.0;
	n *= fract(n) + 0.01;
	n *= 100.0;
	n = mod(n, 255.0);
	
	return n / 255.0;
}

float hash32(vec2 index) {
	return (hash32(index.x) + hash32(index.y)) * 0.5;
}

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float hnoise(float index) {
	return rand(vec2(index, index));
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float noise2(float x) {
	float i = floor(x);
	float ff = fract(x);
	float u = ff * ff * (3.0 - 2.0 * f);
	return mix(hash32(i), hash32(i + 1.0), u);
}

float noise2(vec2 x) {
	vec2 i = floor(x);
	vec2 ff = fract(x);

	// Four corners in 2D of a tile
	float a = hash32(i);
	float b = hash32(i + vec2(1.0, 0.0));
	float c = hash32(i + vec2(0.0, 1.0));
	float d = hash32(i + vec2(1.0, 1.0));

	// Simple 2D lerp using smoothstep envelope between the values.
	// return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
	//			mix(c, d, smoothstep(0.0, 1.0, f.x)),
	//			smoothstep(0.0, 1.0, f.y)));

	// Same code, with the clamps in smoothstep and common subexpressions
	// optimized away.
	vec2 u = ff * ff * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

/*
*************************************************
*                   TEXTURES                    *
*************************************************
*/

vec3 woodenTexture(vec2 uv) {
	// Base wooden color
	vec3 color = vec3(0.6352941176470588, 0.3607843137254902, 0.1450980392156863);
	
	// Wooden pattern
	vec2 p = uv;
	p.x += sin(uv.x * 9.0) * 0.5 + 0.2358;
	p.x += sin(uv.y * 9.0) * 0.25 - 0.15274;
	p.y += cos(dot(uv, uv)) * 0.25 + 0.5882;
	p.y += sin(dot(uv, uv)) * 0.625 - 0.9275;
	p.x *= cos(uv.x);
	p.y *= sin(uv.y);
	
	// distortion
	p.x *= noise(uv * 7.0) * 0.5 + 0.5;
	p.x *= noise(uv * 31.0) * 0.25 + 0.875;
	p.x *= noise(uv * 204.0) * 0.125 + 0.9375;
	p.x *= noise(uv * 2957.0) * 0.0625 + 0.96875;
	p = sqrt(abs(p));
	color *= pow(clamp(abs(cos(dot(p, p) / (length(uv * 2.0) + 1.0) * 25.48285) / length(p)), 0.0, 2.0), 0.1857);
	
	return color;
}

vec3 scratchedMetal(vec2 uv) {
	vec3 color = vec3(0.0);
	// distortion
	uv.x *= noise(uv * 7.0) * 0.5 + 0.5;
	uv.x *= noise(uv * 31.0) * 0.25 + 0.875;
	uv.x *= noise(uv * 204.0) * 0.125 + 0.9375;
	uv.x *= noise(uv * 2957.0) * 0.0625 + 0.96875;
	uv = sqrt(abs(uv));
	
	color += pow(noise2(noise2(uv * vec2(0.000025, 1.0) * 8852.0) * 8482.0), 6.0);
	
	color = clamp(color, 0.0, 1.0) * 0.33;
	color += 0.1;
	
	return color;
}

/*
***********************************************
*             TRANSFORM FUNCTIONS             *
***********************************************
*/

mat2 rotate(float angle) {
	float s = sin(angle);
	float c = cos(angle);
	
	return mat2(c, s, -s, c);
}

/*
*************************************************************************
*                   RAY-SURFACE INTERSECTION FUNCTIONS                  *
*************************************************************************
|                                                                       |
| https://www.iquilezles.org/www/articles/intersectors/intersectors.htm |
\_______________________________________________________________________/
*/

/*
***********************************************
*                   SPHERE                    *
***********************************************
*/

vec2 sphIntersect( in vec3 ro, in vec3 rd, in vec3 ce, float ra )
{
    vec3 oc = ro - ce;
    float b = dot( oc, rd );
    float c = dot( oc, oc ) - ra*ra;
    float h = b*b - c;
    if( h<0.0 ) return vec2(-1.0); // no intersection
    h = sqrt( h );
    return vec2( -b-h, -b+h );
}

/*
***********************************************
*                   PLANE                     *
***********************************************
*/

float plaIntersect( in vec3 ro, in vec3 rd, in vec4 p )
{
    return -(dot(ro,p.xyz)+p.w)/dot(rd,p.xyz);
}

/*
Casts ray to scene and returns it's color
origin 		- ray origin
direction	- ray angles ( from -0.5 to 0.5 )
focus		- where to focus at ( length )
aperture	- aperture size, or how out-of-focuse objects will be diffused
seed		- random seed
*/
vec3 castRay(vec3 origin, vec3 direction, float focus, float aperture, float seed) {
	vec2 position = ( gl_FragCoord.xy - resolution.xy * .5 ) / min(resolution.x, resolution.y);
	vec3 color = vec3(1.0);
	// Ray direction and origin calculations
	vec2 diffuse = (vec2(
		hnoise(position.x + 2.0 + (position.y + 2.0) * resolution.x + fract(time) * 52.5 - seed),
		hnoise(position.x + 2.0 + (position.y + 2.0) * resolution.x + fract(time) * 62.5 + 2.0 - seed)
	) - 0.5) * aperture;
		
	vec3 rd = normalize(vec3(direction + vec3(diffuse / focus, 0.0)));
	vec3 ro = origin - vec3(diffuse, 0.0);
	
	for(int i = 0; i < MAX_RAY_REFLECTIONS; i++) {
		// Initialize with sky color
		vec3 currentColor = vec3(0.6392156862745098, 0.796078431372549, 0.9411764705882353);
		
		// Intersected object characteristics
		vec3 normal = vec3(0.0);
		float depth = 100.0;
		
		// Objects
		float plane = plaIntersect(ro, rd, vec4(0.0, 1.0, 0.0, 0.0));
		float plane2 = plaIntersect(ro, rd, vec4(1.0, 0.0, 0.0, 5.5));
		float plane3 = plaIntersect(ro, rd, vec4(-1.0, 0.0, 0.0, 5.5));
		float sphere = sphIntersect(ro, rd, vec3(.5, .5, 3.5), .5).x;
		float light = sphIntersect(ro, rd, vec3(sin(time * 2.0), 0.75 - cos(time * 4.0) * 0.25, 5.0), .5).x;
		float lamp = sphIntersect(ro, rd, vec3(sin(time) * 0.5 + 0.5, abs(cos(time * 5.5) * 0.4) + .1, 2.75), .1).x;
		
		if(plane > 0.0 && plane < depth) {
			depth = plane;
			currentColor = woodenTexture((rd * plane + ro).zx * 10.0 - 2.0);
			vec3 diffuse = (vec3(
				hnoise(position.x + 2.0 + (position.y + 2.0) * resolution.x + fract(time) * 525.0 + hnoise(float(i)) * 84.0 - seed),
				hnoise(position.y + 2.0 + (position.x + 2.0) * resolution.x + fract(time) * 625.0 + hnoise(float(i)) * 83.0 + 2.0 - seed),
				-hnoise(position.y + 2.0 + (position.x + 2.0) * resolution.x + fract(time) * 625.0 + hnoise(float(i)) * 85.0 + 4.0 - seed)
			) - 0.5) * (floor(hnoise(position.y + 2.0 + (position.x + 2.0) * resolution.x + fract(time) * 625.0 + hnoise(float(i)) * 86.0 + 6.0 - seed) * 2.0) * 0.8 + .2);
			normal = normalize(vec3(diffuse.x, diffuse.z + 1.0, diffuse.y));
		}
		
		if(plane2 > 0.0 && plane2 < depth) {
			depth = plane2;
			currentColor = vec3(1.0, 0.1, 0.01) / 0.9;
			vec3 diffuse = (vec3(
				hnoise(position.x + 2.0 + (position.y + 2.0) * resolution.x + fract(time) * 525.0 + hnoise(float(i)) * 84.0 - seed),
				hnoise(position.y + 2.0 + (position.x + 2.0) * resolution.x + fract(time) * 625.0 + hnoise(float(i)) * 84.0 + 2.0 - seed),
				-hnoise(position.y + 2.0 + (position.x + 2.0) * resolution.x + fract(time) * 625.0 + hnoise(float(i)) * 85.0 + 4.0 - seed)
			) - 0.5) * (floor(hnoise(position.y + 2.0 + (position.x + 2.0) * resolution.x + fract(time) * 625.0 + hnoise(float(i)) * 86.0 + 6.0 - seed) * 2.0) * 0.6 + .4);
			normal = normalize(vec3(1.0 + diffuse.z, diffuse.x, diffuse.y));
		}
		
		if(plane3 > 0.0 && plane3 < depth) {
			depth = plane3;
			currentColor = vec3(0.01, 0.1, 1.0) / 0.9;
			vec3 diffuse = (vec3(
				hnoise(position.x + 2.0 + (position.y + 2.0) * resolution.x + fract(time) * 525.0 + hnoise(float(i)) * 84.0 - seed),
				hnoise(position.y + 2.0 + (position.x + 2.0) * resolution.x + fract(time) * 625.0 + hnoise(float(i)) * 84.0 + 2.0 - seed),
				-hnoise(position.y + 2.0 + (position.x + 2.0) * resolution.x + fract(time) * 625.0 + hnoise(float(i)) * 85.0 + 4.0 - seed)
			) - 0.5) * (floor(hnoise(position.y + 2.0 + (position.x + 2.0) * resolution.x + fract(time) * 625.0 + hnoise(float(i)) * 86.0 + 6.0 - seed) * 2.0) * 0.6 + .4);
			normal = normalize(vec3(-1.0 - diffuse.z, diffuse.x, diffuse.y));
		}
		
		if(sphere > 0.0 && sphere < depth) {
			depth = sphere;
			vec3 pos = sphere * rd + ro;
			vec3 diffuse = (vec3(
				hnoise(position.x + 2.0 + (position.y + 2.0) * resolution.x + fract(time) * 525.0 + hnoise(float(i)) * 84.0 - seed),
				hnoise(position.x + 2.0 + (position.y + 2.0) * resolution.x + fract(time) * 625.0 + hnoise(float(i)) * 84.0 + 2.0 - seed),
				hnoise(position.x + 2.0 + (position.y + 2.0) * resolution.x + fract(time) * 625.0 + hnoise(float(i)) * 84.0 + 24.0 - seed)
			) - 0.5) * (scratchedMetal(direction.xy / (sphere - distance(vec3(.5, .5, 3.5), ro)))) * 0.1;
			normal = normalize(pos - vec3(.5, .5, 3.5) + diffuse);
			currentColor = vec3(0.7);
		}
		
		if(light > 0.0 && light < depth) {
			color *= 15.0;
			break;
		}
		
		if(lamp > 0.0 && lamp < depth) {
			color *= vec3(1.0, 0.8, 0.5) * 2.0;
			break;
		}
		
		if(depth == 100.0) {
			color *= currentColor;
			break;
		}
		
		// Reflect ray
		ro = depth * rd + ro;
		rd = normalize(reflect(rd, normal));
		ro += rd * 0.001; // Move a bit in reflected direction to prevent hitting object, from which we've just reflected
		
		color *= currentColor * 0.9;
		
		// If color is so dark, that it's close to absolute black, we can just stop tracing ray as next iterations won't affect color so much
		if(color.r + color.g + color.b < 0.3) {
			color /= 3.;
			break;
		}
	}
	
	return color;
}

vec3 colorFilter(vec3 color) {
	vec3 filtered = color;
	filtered.r = pow((filtered.r + 0.055)/1.055, 1.2);
	filtered.g = pow((filtered.g + 0.055)/1.055, 1.2);
	filtered.b = pow((filtered.b + 0.055)/1.055, 1.2);
	
	float luminosity = dot(filtered, normalize(vec3(0.89, 1.0, 0.97)));
	filtered = normalize(filtered) * luminosity;
	
	return filtered;
}

vec3 lerp(vec3 a, vec3 b, float i) {
	return a + (b - a) * i;
}

void main( void ) {
	float focalLength = 1.0;
	vec2 position = (( gl_FragCoord.xy - resolution.xy * .5 ) / min(resolution.x, resolution.y)) / focalLength;
	mat2 rotation = rotate(time * 0.1);
	vec3 color = vec3(0.0);
	vec3 origin = vec3(-0.8, 0.5, -5.0);
	origin.xz *= rotation;
	origin.z += 2.5;
	
	vec3 direction = vec3(position, 1.5 - clamp(sin(time * 0.25 - 4.0) * 2.0 + 1.0, 0.0, 1.0) * 0.5);
	direction.xz *= rotation;
	
	for(int i = 0; i < SAMPLES; i++) {
		color += castRay(origin, direction, clamp(sin(time * 0.25 - 4.0) * 2.0 + 1.0, 0.1, 1.0) * 100.0 + distance(origin, vec3(.5, .5, 3.5)) - 10.0, f/1.4, hnoise(float(i) * 52.0) * 2.0);
	}
	
	color /= float(SAMPLES);
	color = colorFilter(color);

	gl_FragColor = vec4( lerp(color, texture2D(backbuffer, gl_FragCoord.xy / resolution).rgb, 0.8), 1.0 );

}