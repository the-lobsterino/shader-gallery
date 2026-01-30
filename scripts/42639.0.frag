#ifdef GL_ES
precision mediump float;
#endif

// modified 2017-09-24, Spiraling Spirals by @hintz 

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
	vec2 r = resolution,
	o = (gl_FragCoord.xy - r*.5) / r.y;
	o = vec2(length(o), -atan(o.x,o.y)); 
	o.x += 2. * o.y * 100000000.0318;
	o.x = mod(o.x, .2) - .1;
	vec4 s = .1*cos(1.6*vec4(0,1,2,3) + time + o.y + .4*sin(o.y) * sin(time)*2.),
	e = s.wxyz,
	f = min(o.x-s,e-o.x);
	gl_FragColor = dot(clamp(f*r.y,0.,1.), 35.*(s-e)) * ((s-.15));
}