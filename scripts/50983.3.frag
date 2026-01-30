// Falling flowers
// Author: @amagitakayosi

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.141592
#define SQRT3 1.7320508


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = smoothstep(0.,1.,f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

vec2 hexCenter(in vec2 p) {
	mat2 skew = mat2(1./1.1457, 0, 0.5, 1);
	mat2 inv = 2. * mat2(1, -0.5, 0, 1./1.1457);

	vec2 cellP = skew * p;	
			
	// Decide which lane the cell is in
	vec2 cellOrigin = floor(cellP); // -10 to 10, skewed
	float celltype = mod(cellOrigin.x + cellOrigin.y, 3.0);
	vec2 cellCenter = cellOrigin; // -10 to -10, skewed
	
	if (celltype == 0.) {
		// do nothing
	}
	else if (celltype == 1.) {
		cellCenter = cellOrigin + 1.;
	}
	else if (celltype == 2.) {
		if (fract(cellP.x) > fract(cellP.y)) {
			cellCenter = cellOrigin + vec2(1, 0);
		}
		else {
			cellCenter = cellOrigin + vec2(0, 1);
		}		
	}
	
	return (cellCenter / SQRT3) * inv;	
}

vec2 rot(in vec2 st, in float t) {
	float c = cos(t), s = sin(t);
	return mat2(c, -s, s, c) * st;
}

float hexLine(in vec2 p, in float width) {		
	p = abs(p);		
	if (p.y < p.x * SQRT3) {
		p = rot(p, -PI * 0.3333);
	}
	
	return smoothstep(1. - width, 1. - width + .01, p.y) * smoothstep(1., .99, p.y);
}	

float triangle(in vec2 p, in float width) {
	p.x = abs(p.x);
	
	float a = atan(p.x, -p.y) / PI;
	if (a > 0.3334) { 
		p = rot(p, 0.6667 * PI);
	}			

	vec2 p2 = p * 1.94;
		
	float c = smoothstep(1. - width, 1. - width + .01, -p2.y) * smoothstep(1., .99, -p2.y);
			
	return c;
}

#define NUM 8.

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    // vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    // vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
    vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hueShift(vec3 c, float t) {
    c = rgb2hsv(c);
    c.x = fract(c.x + t);
    return hsv2rgb(c);
}

float flower(vec2 p, float n, float width) {
	float a = atan(p.y, p.x);
	float l = length(p);
	a += time * 1.;
	l += sin(a * n) * .3;
	
	return smoothstep(.5, .51, l) * smoothstep(.5 + width, .5 + width - .01, l);
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);		
	
	// get seed from x
	float n = fract(noise(vec2(floor(p.x * NUM + 10.))) * 11.);		
		
	p.y += time * .2 + n * 3.;
	p.x = fract(p.x * NUM) * 2. - 1.; 
	p.y = mod(p.y, 2.) *NUM * 2. - 1.;
	
	p.x += noise(p.yy * .3 + time) * .3;
	
	// scale everything a bit
	p *= 1.2;
	

	float x = 0.;
	
	// draw flower		
	float f = 
		(n < 0.166) ? flower(p, 3., .2) :
		(n < 0.333) ? flower(p, 4., .2) :
		(n < 0.500) ? flower(p, 5., .2) :
		(n < 0.666) ? flower(p, 6., .2) :
		(n < 0.833) ? triangle(rot(p, time), 0.1) :
		hexLine(rot(p * 1.2, time), 0.1);
	
	x = smoothstep(.5, .51, f);		

	// get blurred bg
	vec2 uv = gl_FragCoord.xy/resolution;	
	float d = 0.001;
	vec4 b = (		
		texture2D(backbuffer,  uv + vec2(0, 0)) + 
		texture2D(backbuffer,  uv + vec2(0, d)) + 
		texture2D(backbuffer,  uv + vec2(0, -d)) + 
		texture2D(backbuffer,  uv + vec2(d, 0)) +
		texture2D(backbuffer,  uv + vec2(-d, 0))		
	) / 5.;	
	
	vec4 col = vec4(1, .5, 1, 1);
	col.rgb = hueShift(col.rgb, n);
	
	gl_FragColor =  (x + b.a * .98) * col;
}