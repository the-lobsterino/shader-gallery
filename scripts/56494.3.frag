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

int N = 0;

void C(vec2 pos, vec2 center, float radius, inout vec3 color) {
	N++;
	float n = float(N);
	float time = time + n*0.02;
	vec2 cen = center + vec2(sin(center.y*3.*(mouse.y-.5) + time), sin(center.x*10.*(mouse.x-.5) + time))*0.125;
	
	radius = mix(radius, 0.02, .5+.5*cos(n/100.+4.*time+mouse.x*10.));
	//if (distance(pos, cen) <= radius) {
	//	color += vec3(2., 2., 2.);
	//	return true;
	//}
	//square mod
	if (step(cen - radius, pos) * step(pos , cen + radius) == vec2(1, 1))
	{
		color += vec3(.75);
	}
}

void main( void ) {
	vec2 pos = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
 	radiusMultiplier = min(0., -abs(sin(time)) + 0.2);
	vec3 color = vec3(1, pos.y, pos.y);
	
	pos.x -= 0.125;
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
	
	gl_FragColor = vec4(color, 1);
}

