precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ball(vec2 p, float fx, float fy, float ax, float ay) 
{
    float size = 0.10;
    float speed = 1.0;
    vec2 r = vec2(p.x + sin(time * speed * fx) * ax, p.y + cos(time * speed * fy) * ay);	
    return size / length(r);
}

void main(void) 
{
    vec2 q = gl_FragCoord.xy / resolution.xy;
    vec2 p = -1.0 + 2.0 * q;	
    p.x	*= resolution.x / resolution.y;

    float col = 0.0;
	
    col += ball(p, -4.0, 5.0, .5, .5);
    col += ball(p, 3.3, 3.0, .8, .2);
    col += ball(p, 3.0, .4, .5, .3);
    col += ball(p, 1.4, 1.6, .9, .5);
    col += ball(p, 1.5, 1.9, .9, .4);
    col += ball(p, 2.0, .9, .3, .9);
    col += ball(p, 5.0, 5.0, .2, .2);
	
	
    col = max(mod(col, 0.4), min(col, 2.0));
	
    gl_FragColor = vec4(col * 0.12, col * 0.42, col * 0.74, 1.0);
}