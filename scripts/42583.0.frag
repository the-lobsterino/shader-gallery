#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
    vec2 r = vec2(300.0, 300.0),
    o = gl_FragCoord.xy - r;
    o = vec2(length(o) / r.y - .4, atan(o.y,o.x));    
    vec4 s = .1*cos(2.1418*vec4(0,1,2,3) + time + o.y),// + sin(o.y) * sin(time)*2.),
    e = s.yzwx,
    f = min(o.x-s,e-o.x);
	float blur = 2.;
	float lighting1 = 1.0;
	float lighting2 = 1.5;
	float lighting3 = 0.1;
	float matte = 1.0;
    gl_FragColor = dot(clamp(f*r.y/blur,0.,matte), 40.*(s*lighting1-e*lighting2)) * (s-lighting3) - f*.0;
}