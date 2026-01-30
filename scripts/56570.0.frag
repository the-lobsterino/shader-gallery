#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

bool heart(vec2 pos, vec2 center, float size) {
	pos /= size;
	pos -= center / size;
	pos.x += cos(time + pos.y) * .2;
	return pow(pow(pos.x, 2.) + pow(pos.y, 2.) - 1., 3.) - (pow(pos.x, 2.) * pow(pos.y, 3.)) <= 0.; 
}

bool circle(vec2 pos, vec2 center, float radius) {
	pos.x += sin(time + pos.y) * .2;
	return distance(pos, center) <= radius;
}

void main( void ) {
	vec2 pos = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
	pos.y += 0.5; 
	vec3 color = vec3(1, pos.y, pos.y);
	
	if (heart(pos, vec2(0, .9), .3 + abs(sin(time * 2.)) * .1)){
		color = vec3(1, 0, 0);
	}
	
	if(
		heart(pos, vec2(1.2, .0), .1) || 
		heart(pos, vec2(-1.3, .0), .1) || 
		//R
		heart(pos, vec2(-0.9, .2), .037) ||
		heart(pos, vec2(-.85, .2), .037) ||
		heart(pos, vec2(-.8, .2), .037) ||
		heart(pos, vec2(-.9, .15), .037) ||
		heart(pos, vec2(-.75, .15), .037) ||
		heart(pos, vec2(-.9, .1), .037) ||
		heart(pos, vec2(-.75, .1), .037) ||
		heart(pos, vec2(-.9, .05), .037) ||
		heart(pos, vec2(-.85, .05), .037) ||
		heart(pos, vec2(-.8, .05), .037) ||
		heart(pos, vec2(-.9, .0), .037) ||
		heart(pos, vec2(-.75, .0), .037) ||
		heart(pos, vec2(-.9, -.05), .037) ||
		heart(pos, vec2(-.75, -.05), .037) ||
		heart(pos, vec2(-.9, -.1), .037) ||
		heart(pos, vec2(-.7, -.1), .037) ||
		//O
		heart(pos, vec2(-.55, .1), .037) ||
		heart(pos, vec2(-.5, .1), .037) ||
		heart(pos, vec2(-.45, .1), .037) ||
		heart(pos, vec2(-.6, .05), .037) ||
		heart(pos, vec2(-.4, .05), .037) ||
		heart(pos, vec2(-.6, .0), .037) ||
		heart(pos, vec2(-.4, .0), .037) ||
		heart(pos, vec2(-.6, -.05), .037) ||
		heart(pos, vec2(-.4, -.05), .037) ||
		heart(pos, vec2(-.55, -.1), .037) ||
		heart(pos, vec2(-.5, -.1), .037) ||
		heart(pos, vec2(-.45, -.1), .037) ||
		//B
		heart(pos, vec2(-.3, .2), .037) ||
		heart(pos, vec2(-.3, .15), .037) ||
		heart(pos, vec2(-.3, .1), .037) ||
		heart(pos, vec2(-.25, .1), .037) ||
		heart(pos, vec2(-.2, .1), .037) ||
		heart(pos, vec2(-.15, .1), .037) ||
		heart(pos, vec2(-.3, .05), .037) ||
		heart(pos, vec2(-.1, .05), .037) ||
		heart(pos, vec2(-.3, .0), .037) ||
		heart(pos, vec2(-.1, .0), .037) ||
		heart(pos, vec2(-.3, -.05), .037) ||
		heart(pos, vec2(-.1, -.05), .037) ||
		heart(pos, vec2(-.3, -.1), .037) ||
		heart(pos, vec2(-.25, -.1), .037) ||
		heart(pos, vec2(-.2, -.1), .037) ||
		heart(pos, vec2(-.15, -.1), .037) ||
		//E
		heart(pos, vec2(.05, .1), .037) ||
		heart(pos, vec2(.1, .1), .037) ||
		heart(pos, vec2(.15, .1), .037) ||
		heart(pos, vec2(.0, .05), .037) ||
		heart(pos, vec2(.15, .05), .037) ||
		heart(pos, vec2(.15, .0), .037) ||
		heart(pos, vec2(.1, .0), .037) ||
		heart(pos, vec2(.05, .0), .037) ||
		heart(pos, vec2(.0, .0), .037) ||
		heart(pos, vec2(.0, -.05), .037) ||
		heart(pos, vec2(.15, -.1), .037) ||
		heart(pos, vec2(.1, -.1), .037) ||
		heart(pos, vec2(.05, -.1), .037) ||
		//R
		heart(pos, vec2(.25, .1), .037) ||
		heart(pos, vec2(.30, .1), .037) ||
		heart(pos, vec2(.35, .1), .037) ||
		heart(pos, vec2(.25, .05), .037) ||
		heart(pos, vec2(.25, .0), .037) ||
		heart(pos, vec2(.25, -.05), .037) ||
		heart(pos, vec2(.25, -.1), .037) ||
		//T
		heart(pos, vec2(.45, .15), .037) ||
		heart(pos, vec2(.45, .1), .037) ||
		heart(pos, vec2(.5, .1), .037) ||
		heart(pos, vec2(.55, .1), .037) ||
		heart(pos, vec2(.45, .05), .037) ||
		heart(pos, vec2(.45, .0), .037) ||
		heart(pos, vec2(.45, -.05), .037) ||
		heart(pos, vec2(.5, -.1), .037) ||
		heart(pos, vec2(.55, -.1), .037) ||
		//A
		heart(pos, vec2(.65, .1), .037) ||
		heart(pos, vec2(.7, .1), .037) ||
		heart(pos, vec2(.75, .1), .037) ||
		heart(pos, vec2(.8, .1), .037) ||
		heart(pos, vec2(.8, .05), .037) ||
		heart(pos, vec2(.65, .0), .037) ||
		heart(pos, vec2(.7, .0), .037) ||
		heart(pos, vec2(.75, .0), .037) ||
		heart(pos, vec2(.8, .0), .037) ||
		heart(pos, vec2(.65, -.05), .037) ||
		heart(pos, vec2(.8, -.05), .037) ||
		heart(pos, vec2(.65, -.1), .037) ||
		heart(pos, vec2(.7, -.1), .037) ||
		heart(pos, vec2(.75, -.1), .037) ||
		heart(pos, vec2(.8, -.1), .037)
	){
		color = vec3(1, 1, 1);
	}
	gl_FragColor = vec4(color, 1);
}
