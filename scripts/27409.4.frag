#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main(void) {
    vec2 q = gl_FragCoord.xy / resolution.xy;
    vec2 p = -2.0 + 2.0 * q;		
    p.x *= resolution.x / resolution.y;	
	
    float v = p.x + cos(time + p.y);
    	
    vec3 col = vec3(0.1 * max(0.0, p.y), 0.1 * max(0.0, p.x), 0.2 * max(0.0, p.x)) / abs(v * 4.0);	
  
	
    gl_FragColor = vec4(col, 1.0);
}