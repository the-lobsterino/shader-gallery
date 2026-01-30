#ifdef GL_ES
precision mediump float;
#endif

// Twisting Bars 2017-09-27 by @hintz

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
	vec2 r = resolution,
	o = (gl_FragCoord.xy - .5*r) / r.y;
	float p = .5+floor(5.*o.x);
	o.x = mod(o.x, .2) - .1;
	o.y+=p;
	vec4 s = .5*sin(1.6*vec4(0,1,2,3)+p*.3*time+sin(o.y*4.+p*3.+sin(time))),
	e = s.yzwx, 
	f = min(o.x-s,e-o.x);
	gl_FragColor = dot(clamp(-1.+f*r.y,0.,1.),40.*(s-e))*(s-.21)+f*12.5;
}