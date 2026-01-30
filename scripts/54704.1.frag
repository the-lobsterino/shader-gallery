// https://www.shadertoy.com/view/XtVXWc
// thank you IQ + sun maker :)

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	vec2 p = gl_FragCoord.xy / resolution.xy;
    vec2 q = p - vec2(0.35, 0.7);
    float t = time;
    
    // base sky color
    vec3 col = mix(vec3(1.0, 0.2, 0.0), vec3(1.0, 0.6, 0.0), sqrt(p.y)/2.0);
    
    // sun
    float r = 0.175;
    vec2 sp = vec2(p.x, p.y * (resolution.y / resolution.x)) - vec2(0.95 + 0.004 * sin(p.y * 80.0 + t * 4.0), 0.02);
    col += 1.0 * (0.8 - smoothstep(r, r + 0.05, length(sp)*1.5));
    
    // canopy
    r = 0.2 + 0.1 * cos(3.3 + atan(q.y,q.x) * 9.0 + 20.0*q.x)-  0.02 + 0.004 * sin(q.x * 80.0 + t * 4.0); // a bit animated
    col *= smoothstep(r, r + 0.04, length(q));
    
    // trunk
    r = 0.01 + 0.025 * (1.0 - p.y);
    r += 0.002 * cos(q.y * 100.0);
    r += exp(-30.0 * p.y);
    col *= 1.0 - (1.0 - smoothstep(r, r + 0.01, abs(q.x - 0.2 * sin(2.0 * q.y)))) * (1.0 - smoothstep(0.01, 0.01, q.y));
    
    gl_FragColor = vec4(col, 1.0);	
}