#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
float sdRoundedBox( vec2 p, vec2 b, vec4 r)
{
    r.xy = (p.x>0.0)?r.xy : r.zw;
    r.x  = (p.y>0.0)?r.x  : r.y;
    vec2 q = abs(p)-b+r.x;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
}

float sdArc( in vec2 p, in vec2 sca, in vec2 scb, in float ra, float rb )
{
    p *= mat2(sca.x,sca.y,-sca.y,sca.x);
    p.x = abs(p.x);
    float k = (scb.y*p.x>scb.x*p.y) ? dot(p,scb) : length(p);
    return sqrt( dot(p,p) + ra*ra - 2.0*ra*k ) - rb;
}

float sdRoundedX( in vec2 p, in float w, in float r )
{
    p = abs(p);
    return length(p-min(p.x+p.y,w)*0.5) - r;
}

void main( void ) {

    float s = (sin(time ) + 1.0) / 2.0;
    vec4 r = vec4(45, 90, 120, 240) * s;
    vec2 size = resolution.xy/2.0;
    
    float ta = 3.14 * s;
    float tb = 3.14 * s;
    float rb = 5.0;
    
    float box = sdRoundedBox(gl_FragCoord.xy-size, size, r);
    float arc = sdArc(gl_FragCoord.xy - size.xy,vec2(sin(ta),cos(ta)),vec2(sin(tb),cos(tb)), 50.7, rb);
    float x = sdRoundedX(gl_FragCoord.xy - size, size.y, 30.0 * s);
    x = abs(x) - 1.0;
    vec3 col = vec3(box, arc, x);
    
    gl_FragColor = vec4(col, 1.0);

}