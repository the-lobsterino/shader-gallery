precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ball(vec2 p, float fx, float fy, float ax, float ay) {
    vec2 r = vec2(p.x + cos(time * fx) * ax, p.y + sin(time * fy) * ay);	
    return 0.09 / length(r);
}

void main(void) {
    vec2 q = gl_FragCoord.xy / resolution.xy;
    vec2 p = -1.0 + 2.0 * q;	
    p.x	*= resolution.x / resolution.y;

    float col = 0.0;
    col += ball(p, 1.0, 2.0, 0.1, 0.2);
    col += ball(p, 1.5, 2.5, 0.5, 0.3);
    col += ball(p, 2.0, 3.0, 0.3, 0.4);
    col += ball(p, 2.5, 3.5, 0.4, 0.5);
    col += ball(p, 3.0, 4.0, 0.5, 0.6);	
    col += ball(p, 1.5, 0.5, 0.6, 0.7);
    col += ball(p, 0.5, 3.1, 1.6, 0.9);
    col += ball(p, 1.0, 4.3, 1.6, 0.1);
	
    col *= 0.8;	
	
	if(col>10.0) col=sin(time*1.0-col);
	if(col<0.6) col = sin(fract(col)*time*0.158);
	
    gl_FragColor = vec4(col*sin(fract(time*3.14159)), sin(time) * col * sin(fract(time)*10.0*col), col * cos(col*fract(time*0.1)), 1.0);
}