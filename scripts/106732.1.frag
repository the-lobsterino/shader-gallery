/*

	zoom-accumulate
	2023 stb
	
	Left mouse button	= move
	Middle mouse button	= zoom
	
	The sampling will (hopefully) reset when moving the mouse, and converge when still.
	(Mouse movement detection is a WIP.)
*/

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

varying vec2 surfacePosition;
uniform vec2 surfaceSize;

#define MOD3 vec3(443.8975, 397.2973, 491.1871) // uv range
vec2 hash22(vec2 p) {
	vec3 p3 = fract(vec3(p.xyx) * MOD3);
    p3 += dot(p3, p3.yzx+19.19);
    return fract(vec2((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y));
}


vec2 cInv(vec2 p, vec2 o, float r) {
    return (p-o) * r * r / dot(p-o, p-o) + o;
}

vec2 pinnedInversion(in vec2 p, vec2 o) {
    p = p / dot(p, p) - o;
    p = p / dot(p, p);// + 1.;
    return p;
}

float fractal(in vec2 p) {
	p += .75;
	const int I = 32;
	vec2 o = vec2(.825, .37);
	float f = 0.;
	for(int i=0; i<I; i++) {
		p = pinnedInversion(p, o);
		p = abs(p);
		p = 2.*(p-.5);
		f += 2.*max(0., 1.-(length(p)/sqrt(2.))) / float(I);
	}
	return f;
}

#define res resolution

// trying to make a float consistent after being passed through buffer... it's for mouse movement detection
float format(float f) {
	return floor(f*resolution.y/20.)/256.;
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy / res;
	vec3 old = texture2D(backbuffer, uv).rgb;
	
	float Mix = 3./255.;
	float Blur = 1.;
	vec2 p = surfacePosition + hash22(mod(uv+time, 100.)) * surfaceSize.y / res.y * Blur;
	
	vec3 ret;
	
	vec3 oldp = texture2D(backbuffer, vec2(0.)).rgb;
	
	if(format(oldp.x) == format(mouse.x) && format(oldp.y) == format(mouse.y))
		ret = mix(old, vec3(fractal(p)), Mix);
	else
		ret = vec3(fractal(p));
			      
	if(floor(gl_FragCoord.x)==0. && floor(gl_FragCoord.y)==0.)
		ret = vec3(mouse, 0.);
	
	gl_FragColor = vec4(ret, 1.);
}