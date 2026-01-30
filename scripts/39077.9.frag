#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

vec4 px(int dx, int dy) {
	// Fetch pixel RGBA at relative location
	vec2 pos = vec2(gl_FragCoord.x - float(dx), gl_FragCoord.y - float(dy));
	if (pos.x < 0.0) {pos.x = resolution.x-1.0;;}
	if (pos.y < 0.0) {pos.y = resolution.y-1.0;}
	if (pos.x >= resolution.x) {pos.x = 0.0;}
	if (pos.y >= resolution.y) {pos.y = 0.0;}
	return texture2D(backbuffer, pos / resolution);
}

vec4 mx(vec4 v) {
	v.r = (v.r > 0.1) ? 1.0 : 0.0;
	v.g = (v.g > 0.1) ? 1.0 : 0.0;
	v.b = (v.b > 0.1) ? 1.0 : 0.0;
	v.a = (v.a > 0.1) ? 1.0 : 0.0;
	return v;
}

float rand(int seed, vec2 pos) {
	// Random float based on time, location and seed
	return fract(sin(time*23.254 + float(seed)*438.5345 - pos.x*37.2342 + pos.y*73.25423)*3756.234);
}

float DoLife(float life, float neighborlife, float food, float poison) {
	bool living = life > 0.1;
	if ((neighborlife > 0.0) && (food > 0.0)) {living = true;}
	if (neighborlife >= 3.0*0.1) {living = false;}
	if (poison * 0.5*0.1 >= food) {living = false;}
	return living ? 1.0 : 0.0;
}

void main( void ) {
	vec4 here = px(0,0);
	
	if (here.a > 0.0) {
	
		if ((mod(time, 0.3) > 1.0/60.0) && (mouse.y < 0.1)) {
			// Mouse in bottom tenth of screen for slow motion
			gl_FragColor.rgba = here.rgba;
			return;
		}
		
		here = mx(here);
		
		vec4 sum = here;
		sum += mx(px(-1, 0));
		sum += mx(px( 0,-1));
		sum += mx(px( 0, 1));
		sum += mx(px( 1, 0));
	
		here.r = DoLife(here.r, sum.r, sum.g, sum.a);
		here.g = DoLife(here.g, sum.g, sum.b, sum.r);
		here.b = DoLife(here.b, sum.b, sum.a, sum.g);
		here.a = DoLife(here.a, sum.a, sum.r, sum.b);
		gl_FragColor.rgba = here.rgba*0.2 + vec4(0.0,0.0,0.0,0.3*0.02);
	} else {
		vec2 pos = gl_FragCoord.xy - resolution.xy * 0.5;
		if (length(pos) < 40.0) {
			gl_FragColor.rgba = vec4(rand(464, pos)>0.01?1.0:0.0, rand(153, pos)>0.01?1.0:0.0, rand(83, pos)>0.01?1.0:0.0, rand(9, pos)>0.01?1.0:0.3)*0.2;
		} else {
			gl_FragColor.rgba = vec4(0.0, 0.0, 0.0, 0.3)*0.2;
		}
	}
}