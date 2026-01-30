#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Tas d'poles
// https://www.shadertoy.com/view/Mslfzl

float df(vec2 p, vec2 dir, float v)
{
    float a = atan(dir.x, dir.y);
    p *= mat2(cos(a), -sin(a), sin(a), cos(a));
    p *= 16.; p.y *= -0.75;
    float r = dot(p,p) * 0.02 * cos(length(vec2(p.x-dir.y, dir.x-p.y))*3.-time * (20.+4.*cos(time/4.7)))*v;
    p *= mat2(cos(r), -sin(r), sin(r), cos(r));
    return mix(max(abs(p.x)+p.y, abs(p.y*p.x)), length(p)*5., 0.04);
}

vec2 move(vec2 g, vec2 p, float t)
{
    return sin( t * 2. + 9. * fract(sin((floor(g)+p)*mat2(2,7,2,5)*mat2(7,-2,2,5))));
}
varying vec2 surfacePosition;
void main()
{
    vec2 g = gl_FragCoord.xy;
    float d = 10.;
    vec2 p = g /= resolution.y / 10., ac,al; 
       	
    for(int x=-1;x<=1;x++)
    for(int y=-1;y<=1;y++)
        p = vec2(x,y),
        al = move(g,p, time-0.1),
        ac = move(g,p, time),
        p += .5 + .5 * ac - fract(g),
        d = min(d, df(p, ac-al, length(ac-move(g,p, time+0.1))*0.5));
    
    gl_FragColor = mix(vec4(0.7), vec4(1.,.98,.96,1.)*min(1., 1.1-0.2*length(surfacePosition)), d);
    gl_FragColor.a = 1.;

}