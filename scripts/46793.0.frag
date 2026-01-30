#ifdef GL_ES
precision mediump float;
#endif

// Spiraling Balloon Spirals by @hintz 2017-09-25

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
	vec2 r = resolution,
	o = (gl_FragCoord.xy - r*.5) / r.y;
	//o *= 2.5;
	o = vec2(dot(o,o), atan(o.y,o.x) + (5.*atan(o.y,o.x))); 
	//o = vec2(length(o), atan(o.y,o.x) + (5.*atan(o.y,o.x))); 
	o.x += 2.5 * o.y * .0318;
	o.x = mod(o.x, .2) - .1;
	vec4 s = .1*cos(1.3*vec4(0,1,2,3) - time + o.y + 1.8*sin(o.y) * sin(time)*1.5),
	e = s.wxyz,
	f = min(o.x-s,e-o.x);
	
	
	
	vec4 col = 0.4 *(dot(clamp(f*2.5,0.,1.), 300.*(s-e)) * (s-.2) +
	dot(clamp(f*r.y,0.,1.), 20.*(s-e)) * ((s-.15)));

        vec2 uv2 = (gl_FragCoord.xy-resolution/vec2(2.0)) / resolution.y;
        float rr = length(uv2);//(dot(uv2,uv2));
        (rr>0.4) ? ((rr<0.408) ? col = col : col*=0.0) : col*=0.0;
	
	gl_FragColor = vec4(10,215,0,1);
}