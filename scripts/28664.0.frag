precision highp float;

uniform float time;
uniform vec2 resolution;



void main() {

    vec2 q = gl_FragCoord.xy / resolution.xy;
    vec2 p = (4.0 * q) - 2.0;  
    p.x *= resolution.x / resolution.y;

	
    vec2 r = vec2(p.x + sin(time * 3.0) * 0.6 , p.y + cos(time * 4.0) * 0.5); 
    float col = 0.25/ length(r);
	
    gl_FragColor = vec4(col * 0.77, col * 0.77, col * 0.90, 1.0);
}