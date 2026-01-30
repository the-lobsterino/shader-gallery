precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ball(vec2 p, float fx, float fy, float ax, float ay) {
    vec2 r = vec2(p.x + sin(time / 2.0 * fx) * ax * 4.0, p.y + cos(time/ 2.0 * fy) * ay * 4.0);	
    return 0.05 / length(r);
}

void main(void) {
    vec2 q = gl_FragCoord.xy / resolution.xy;
    vec2 p = -2.0 + 8.0 * q * .5;
    p.x	*= resolution.x / resolution.y;

    float col = 0.0;
    col += ball(p, 1.0, 2.0, 0.3, 0.1);
    col += ball(p, 2.5, 2.5, 0.4, 0.2);
    col += ball(p, 2.0, 3.0, 0.5, 0.3);
    col += ball(p, 2.5, 3.5, 0.6, 0.4);
    col += ball(p, 3.0, 4.0, 0.7, 0.5);	
    col += ball(p, 1.5, 2.5, 0.8, 0.6);
    col += ball(p, 3.1, 1.5, 0.9, 0.7);
    col += ball(p, 3.5, 2.5, 0.9, 0.6);
    col += ball(p, 4.1, 3.5, 0.9, 0.5);
	
    gl_FragColor = vec4(col * 0.4, col * 0.5, col * 0.9 * sin(time), 1.0);
}