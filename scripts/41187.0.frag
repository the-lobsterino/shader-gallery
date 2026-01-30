precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ball(vec2 p) {
    vec2 r = vec2(p.x , p.y);	
    return 0.05 / length(r);
}

void main(void) {
    vec2 q = gl_FragCoord.xy / resolution.xy;
    vec2 p = -0.5 + q;	
    p.x	*= resolution.x / resolution.y;

    float col = 0.0;
    //col += ball(p, 2.0, 3.0, 4.1, 5.2);
    col += ball(p);
    /*col += ball(p, 1.0, 4.0, 0.5, 0.4);
    col += ball(p, 2.5, 3.5, 0.4, 0.5);
    col += ball(p, 3.0, 4.0, 0.5, 0.6);	
    col += ball(p, 1.5, 0.5, 0.6, 0.7);
    col += ball(p, 0.1, .5, 0.6, 0.7);
	*/
    col = max(mod(col, 0.4), min(col, 2.0));
	
    gl_FragColor = vec4(col * 0.8, col * 0.3, col * 0.3, 1.0);
}