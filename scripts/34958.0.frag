precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// Mods By NRLABS 2016
float speed = .50;

float ball(vec2 p, float fx, float fy, float ax, float ay) {
    vec2 r = vec2(p.x + sin(time*speed / 2.0 * fx) * ax * 4.0, p.y + cos(time*speed/ 2.0 * fy) * ay * 4.0);	
    return .075 / length(r);
}

void main(void) {
    vec2 q = gl_FragCoord.xy / resolution.xy;
    vec2 p = q * 2.0 - 1.0;
    p.x	*= resolution.x / resolution.y;

    float col = 0.0;
    col += ball(p, 31.0, 22.0, 0.03, 0.1);
    col += ball(p, 22.5, 22.5, 0.04, 0.04);
    col += ball(p, 12.0, 23.0, 0.05, 0.03);
    col += ball(p, 32.5, 33.5, 0.06, 0.04);
    col += ball(p, 23.0, 24.0, 0.07, 0.03);	
    col += ball(p, 21.5, 22.5, 0.08, 0.02);
    col += ball(p, 33.1, 21.5, 0.09, 0.07);
    col += ball(p, 23.5, 32.5, 0.09, 0.06);
    col += ball(p, 14.1, 13.5, 0.09, 0.05);
	
    gl_FragColor = vec4(col * 0.44, col * 0.34, col * 0.9 * sin(time), 1.0);
}