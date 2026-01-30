#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Tas d'poles
// https://www.shadertoy.com/view/Mslfzl
float random (in vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233))) 
                * 43758.5453123);
}

mat2 rotate(float angle)
{
	return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
}
float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
    
    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( random( i + vec2(0.0,0.0) ), 
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ), 
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}


float df(vec2 p, vec2 dir)
{
    float a = atan(dir.x, dir.y);
    p *= rotate(a);
    p *= 5.; p.y *=-1.;
    float r = dot(p,p) ;//*cos(time * 40.);
    p *= rotate(r);
    return r; //max(abs(p.x)+p.y, abs(p.y*p.x)) +length(p)*0.5;
}

vec2 move(vec2 g, vec2 p, float t)
{
	return sin( t * 2. + 9. * fract(sin((floor(p))*mat2(1,1,1,1)*mat2(1,-1,1,-1))));
}
// g=g*rotate((135./180.)*3.14);
void main()
{
    vec2 g = gl_FragCoord.xy;
    float d = 9.;
    vec2 p = g /= resolution.y / 10., ac,al; 
    g=g*rotate((135./180.)*3.14);
      
    for(int x=-1;x<=1;x++)
    for(int y=-1;y<=1;y++)
        p = vec2(x,y),
        al = move(g,p, time-0.1),
        ac = move(g,p, time),
        p += .5 + .5 * ac - fract(g),
        d = min(d, df(p,ac-al));
    
    gl_FragColor = sqrt(vec4(.5,1,1,1)-mix(0., 1., d));
    gl_FragColor.a = 1.;

}