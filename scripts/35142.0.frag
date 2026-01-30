#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Return distance from point 'p' to line segment 'a b':
float line_distance(vec2 p, vec2 a, vec2 b)
{
    float dist = distance(a,b);
    vec2 v = normalize(b-a);
    float t = dot(v,p-a);
    vec2 spinePoint;
    if (t > dist) spinePoint = b;
    else if (t > 0.0) spinePoint = a + t*v;
    else spinePoint = a;
    return distance(p,spinePoint);
}

void main()
{
    vec2 center = vec2(0.5, 0.5);
    vec2 p = ( gl_FragCoord.xy / resolution.xy ) - center;
    p.x *= resolution.x/resolution.y;
    
    // lightsaber (blue)
    float saber1 = line_distance(p, vec2(-0.20, -0.20), vec2(0.10*sin(time*7.0)*3.0, 0.40*cos(time*5.0)));
    float c1 = (0.8 - 24.0 * saber1 + abs(sin(time*2.0))*0.1)*2.0;

    // lightsaber (red)
    float saber2 = line_distance(p, vec2(0.30, -0.20), vec2(-0.50*cos(time*3.0), 0.20*sin(time*5.0)));
    float c2 = (0.8 - 20.0 * saber2 + abs(cos(time*2.0))*0.1)*2.0;

    gl_FragColor = vec4(max(c1*0.5,c2), max(c1*0.8,c2 *0.5), max(c1*.5, c2*0.8), 1.0);
}