#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (in vec2 st) { 
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))
		 * 43758.5453123);
}

// The MIT License
// Copyright © 2013 Inigo Quilez
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

void main()
{
    vec2 r = resolution,
    o = gl_FragCoord.xy - r/2.;
    o = vec2(length(o) / r.y - .3, atan(o.y,o.x));   
o = abs(o+o);
	o = mod(o, 8.);
	o += vec2(cos(time)*.2, sin(time));
    vec4 s = .1*cos(1.6*vec4(0,1,2,3) + noise(vec2(time)) + o.y + sin( (o.y / o.x + o.y * o.x)+noise(vec2(time))) * sin(time)*1.),
    e = s.yzwx,
    f = min(s,e+o.x);
    gl_FragColor = dot(clamp(f*r.x,0.,1.), 400.*(s-e)) / (s*s-2.) / f*f;
}