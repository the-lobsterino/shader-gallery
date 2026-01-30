#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const float pi = 3.1415926535897932384626433832795;

vec4 px(int dx, int dy) {
	// Fetch pixel RGBA at relative location
	vec2 pos = vec2(gl_FragCoord.x - float(dx), gl_FragCoord.y - float(dy));
	if (pos.x < 0.0) {pos.x = resolution.x-1.0;;}
	if (pos.y < 0.0) {pos.y = resolution.y-1.0;}
	if (pos.x >= resolution.x) {pos.x = 0.0;}
	if (pos.y >= resolution.y) {pos.y = 0.0;}
	return texture2D(backbuffer, pos / resolution);
}

bool shape(vec2 pos, float ct) {
	return (length(pos) < ((abs(mod(atan(pos.y, pos.x)*4.0+ct*0.29, pi)-pi/2.0) > 0.12 + 0.1*sin(ct*0.32)) ? 0.0 : 10.2));
}

void main( void ) {
	vec2 pos = gl_FragCoord.xy / resolution.xy - 0.5;
	pos.x *= resolution.x/resolution.y;
	pos *= 3.0;
	float cd = length(pos);
	float ct = time + cd * 7.0 * cos(time*0.030385823 - cd*0.5);

	vec4 bkg = px(0,0);
	gl_FragColor = vec4(bkg.rgb - 1.0/255.0, 1.0);

	float sep = pi * 2.0 / 3.0;
	for (int i=0; i<30; i++) {
		pos = abs(pos);
		
		if (shape(pos, ct)) {
			float hue = ct * 0.5 + float(i)*0.;
			float og = 0.307*float(i);
			float ob = -0.471*float(i);
			gl_FragColor = vec4(sin(hue)+0.0, 0.0, sin(hue*1.239283+ob-sep)-0.3, 1.0);
			return;
		}
		pos -= 0.5 * mouse.x + sin(time*0.145634 + cd*0.2523);
		
		vec2 rp = pos;
		float ang = pi * mouse.y + 3.0 * cos(time*0.1296958 - cd*0.1563);
		pos.x = rp.x*cos(ang) - rp.y*sin(ang);
		pos.y = rp.y*cos(ang) + rp.x*sin(ang);
	}
}