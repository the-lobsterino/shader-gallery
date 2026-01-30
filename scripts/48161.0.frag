// Just for fun
// I just take a shader written by someone and change something.

// So before using this shader in your projects,
// please make sure it can't be optimized significantly.
// me2beats, 2018

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main()
{
	float t;
	t = time + 8.0;
    vec2 r = resolution,
    o = gl_FragCoord.xy - r/2.;
    o = vec2(length(o) / r.y - .3, sin(atan(o.y,o.x)));    
    vec4 s = 0.08*cos(1.5*vec4(0,1,2,3) + t + o.y + cos(o.y) * cos(8.0)),
    e = s.yzwx, 
    f = max(o.x-s,e-o.x);
    gl_FragColor = dot(clamp(f*r.y,0.,1.), 80.*(s-e)) * (s-.1) + (e - o.x);
}