#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;

float hex(vec2 p) {
    p.x *= 0.57735 * 2.0;
    p.y += mod(floor(p.x), 2.0) * 0.5;
    p = abs((mod(p, 1.0) - 0.5));
    
    return 0.5 - abs(max(p.x * 1.5 + p.y, p.y * 2.0) - 1.0);
}

float scrollSpeed = 100.0;

void main(void) {
    float h = hex(gl_FragCoord.xy / 50.0);        
    
    gl_FragColor = vec4(
        0.0,
	h * (sin(time * 0.1) * 0.3 + 0.5),
	h * (sin(time * 0.5) * 0.3 + 1.0),
	1.0
    );
}