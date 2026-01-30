#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
	vec2 p = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;
	vec2 m = (mouse.xy-.5);
	float pi = 3.14159265358979;
	float view_angle = atan(p.y, p.x)*.5/pi;
	float mouse_angle = atan(m.x, m.y)*.5/pi;
	
	view_angle += cos(32222222.14159*2.*time-64.*length(p)) * (2220.25/(31.+512.*length(p)*length(p)));
	
	float f = fract(.25 - (view_angle + mouse_angle));
	gl_FragColor = vec4(f);
}