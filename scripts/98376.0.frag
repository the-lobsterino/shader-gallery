#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

float t = time * 9.9;

void main()
{
    vec2 r = resolution,
    o = surfacePosition;//gl_FragCoord.xy - resolution/2.;
    o = vec2(length(o) - ((1.+sin(t))/8.+.1), atan(o.y,o.x));    
    vec4 s = 0.07*cos(vec4(4.5,3,1.5,0) + t + o.y),
    e = s.yzwx, 
    f = max(o.x-s,e-o.x);
    gl_FragColor = dot(clamp(f*r.y,0.,1.), 72.*(s-e)) * (s-.1) + f;
}