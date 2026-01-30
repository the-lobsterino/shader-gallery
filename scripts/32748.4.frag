#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

void main(){
	vec2 p = gl_FragCoord.xy / resolution * 2.0 - 1.0;
	p.x *= resolution.x/resolution.y;
	vec2 m = (mouse.xy-.5);
	float pi = 3.14159265358979;
	float view_angle = atan(p.y, p.x)*.5/pi;
	float mouse_angle = atan(m.x, m.y)*.5/pi;
	
	view_angle += cos(3.14159*2.*time-64.*length(p)) * (0.25/(1.+512.*length(p)*length(p)));
	
	
	float t = time;
	float l = length(p);
	if(l > 0.1) t /= 60.;
	if(l > 0.2) t /= 5.;
	if(l > 0.4) t /= 24.;
	if(l > 0.8) t /= 24.;
	
	float f = fract(.25 - (view_angle + t));
	
	vec4 buffer = texture2D(renderbuffer, (gl_FragCoord.xy+vec2(0,1)) / resolution.xy);
	if(l < 0.1) f *= 0.75;
	if(l < 0.2) f *= 0.75;
	if(l < 0.4) f *= 0.75;
	if(l < 0.8) f *= 0.75;
	gl_FragColor = max(vec4(f), buffer - 1./128.);
}