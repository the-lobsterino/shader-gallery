#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float radiusMultiplier;

float rand(float x) {
    return fract(sin(x) * 5413.93);
}

float rand2(float x) {
    return fract(sin(x) * 432.654) * 2. - 1.;
}


bool circle(vec2 pos, vec2 center, float radius, inout vec3 color) {
	float rad = radius;//  + radiusMultiplier * rand(pos.y * pos.x) * .1;
	vec2 cen = vec2(center.x + sin(center.y + time * 2.7)*.3, center.y + sin(center.x + time*2.)*.3);
	if (distance(pos, cen) <= rad) {
		color = vec3(1., 1. - radiusMultiplier, 1. - radiusMultiplier);
		return true;
	}
	return false;
}

#define C(x,y,z,w) if (circle(x,y,z,w)) break;

void main( void ) {
	vec2 pos = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
 	radiusMultiplier = min(0., -abs(sin(time)) + 0.2);
	vec3 color = vec3(1, pos.y, pos.y);
	
	for (int i=0;i<1;i++) {
		//R
		C(pos, vec2(-.9, .2), .037, color);
		C(pos, vec2(-.85, .2), .037, color);
		C(pos, vec2(-.8, .2), .037, color);
		C(pos, vec2(-.9, .15), .037, color);
		C(pos, vec2(-.75, .15), .037, color);
		C(pos, vec2(-.9, .1), .037, color);
		C(pos, vec2(-.75, .1), .037, color);
		C(pos, vec2(-.9, .05), .037, color);
		C(pos, vec2(-.85, .05), .037, color);
		C(pos, vec2(-.8, .05), .037, color);
		C(pos, vec2(-.9, .0), .037, color);
		C(pos, vec2(-.75, .0), .037, color);
		C(pos, vec2(-.9, -.05), .037, color);
		C(pos, vec2(-.75, -.05), .037, color);
		C(pos, vec2(-.9, -.1), .037, color);
		C(pos, vec2(-.7, -.1), .037, color);
		//O
		C(pos, vec2(-.55, .1), .037, color);
		C(pos, vec2(-.5, .1), .037, color);
		C(pos, vec2(-.45, .1), .037, color);
		C(pos, vec2(-.6, .05), .037, color);
		C(pos, vec2(-.4, .05), .037, color);
		C(pos, vec2(-.6, .0), .037, color);
		C(pos, vec2(-.4, .0), .037, color);
		C(pos, vec2(-.6, -.05), .037, color);
		C(pos, vec2(-.4, -.05), .037, color);
		C(pos, vec2(-.55, -.1), .037, color);
		C(pos, vec2(-.5, -.1), .037, color);
		C(pos, vec2(-.45, -.1), .037, color);
		//B
		C(pos, vec2(-.3, .2), .037, color);
		C(pos, vec2(-.3, .15), .037, color);
		C(pos, vec2(-.3, .1), .037, color);
		C(pos, vec2(-.25, .1), .037, color);
		C(pos, vec2(-.2, .1), .037, color);
		C(pos, vec2(-.15, .1), .037, color);
		C(pos, vec2(-.3, .05), .037, color);
		C(pos, vec2(-.1, .05), .037, color);
		C(pos, vec2(-.3, .0), .037, color);
		C(pos, vec2(-.1, .0), .037, color);
		C(pos, vec2(-.3, -.05), .037, color);
		C(pos, vec2(-.1, -.05), .037, color);
		C(pos, vec2(-.3, -.1), .037, color);
		C(pos, vec2(-.25, -.1), .037, color);
		C(pos, vec2(-.2, -.1), .037, color);
		C(pos, vec2(-.15, -.1), .037, color);
		//E
		C(pos, vec2(.05, .1), .037, color);
		C(pos, vec2(.1, .1), .037, color);
		C(pos, vec2(.15, .1), .037, color);
		C(pos, vec2(.0, .05), .037, color);
		C(pos, vec2(.15, .05), .037, color);
		C(pos, vec2(.15, .0), .037, color);
		C(pos, vec2(.1, .0), .037, color);
		C(pos, vec2(.05, .0), .037, color);
		C(pos, vec2(.0, .0), .037, color);
		C(pos, vec2(.0, -.05), .037, color);
		C(pos, vec2(.15, -.1), .037, color);
		C(pos, vec2(.1, -.1), .037, color);
		C(pos, vec2(.05, -.1), .037, color);
		//R
		C(pos, vec2(.25, .1), .037, color);
		C(pos, vec2(.30, .1), .037, color);
		C(pos, vec2(.35, .1), .037, color);
		C(pos, vec2(.25, .05), .037, color);
		C(pos, vec2(.25, .0), .037, color);
		C(pos, vec2(.25, -.05), .037, color);
		C(pos, vec2(.25, -.1), .037, color);
		//T
		C(pos, vec2(.45, .15), .037, color);
		C(pos, vec2(.45, .1), .037, color);
		C(pos, vec2(.5, .1), .037, color);
		C(pos, vec2(.55, .1), .037, color);
		C(pos, vec2(.45, .05), .037, color);
		C(pos, vec2(.45, .0), .037, color);
		C(pos, vec2(.45, -.05), .037, color);
		C(pos, vec2(.5, -.1), .037, color);
		C(pos, vec2(.55, -.1), .037, color);
		//O
		C(pos, vec2(.7, .1), .037, color);
		C(pos, vec2(.75, .1), .037, color);
		C(pos, vec2(.8, .1), .037, color);
		C(pos, vec2(.85, .05), .037, color);
		C(pos, vec2(.65, .05), .037, color);
		C(pos, vec2(.85, .0), .037, color);
		C(pos, vec2(.65, .0), .037, color);
		C(pos, vec2(.85, -.05), .037, color);
		C(pos, vec2(.65, -.05), .037, color);
		C(pos, vec2(.7, -.1), .037, color);
		C(pos, vec2(.75, -.1), .037, color);
		C(pos, vec2(.8, -.1), .037, color);

	}
	
	gl_FragColor = vec4(color, 1);
}

