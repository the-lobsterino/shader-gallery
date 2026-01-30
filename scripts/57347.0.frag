#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
    float t = sin(time/100.)*10.;    
    vec2 r = resolution*sin(time),
    o = gl_FragCoord.xy - r/2.;
    o = vec2(length(o) / r.y - .3, atan(o.x,o.y));    
    vec4 s = .1*cos(1.6*vec4(0,1,2,3) + t + o.x + sin(o.x) / cos(3.9*o.y) * tan(o.y) * cos(sin(atan(t)))*1.5),
    e = s.yzwx, 
    f = min(o.x-s,e-o.x);
	
	
    vec4 temp_color = dot(clamp(f*r.y,0.001,1.), 0.1*((s-e)/(e+s))) / (s-.1) / f;
    gl_FragColor = temp_color;
}