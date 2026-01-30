#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
    vec2 r = vec2(600,330),
    o = gl_FragCoord.xy - r/2.;
    o = vec2(length(o) / r.y - .3, atan(o.y,o.x));    
    vec4 s = .07*cos(1.*vec4(1,2,3,0) + time + o.y + sin(o.x) * sin(time)),
    e = s.yzwx, 
    f = max(o.x-s,e-o.x);
    gl_FragColor = dot(clamp(f*r.y,0.,1.), 72.*(s-e)) * (s-.1) + f;
}