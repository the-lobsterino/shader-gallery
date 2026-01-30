#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define time time/2.+gl_FragCoord.y/40.*cos(time)/2.+gl_FragCoord.x/120.*sin(time)/3.

void main()
{
    vec2 r = resolution,
    o = gl_FragCoord.xy - r/2.;
    o = vec2(length(o) / r.y - .3, atan(o.y*0.,o.x*0.));    
    vec4 s = .1*cos(1.6*vec4(0,1,2,3) + time + o.y + sin(o.y) * sin(time)*2.),
    e = s.yzwx, 
    f = min(o.x-s,e-o.x);
    gl_FragColor = dot(clamp(f*r.y,0.,1.), 40.*(s-e)) * (s-.1) + f;
}