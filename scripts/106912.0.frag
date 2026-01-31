#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);
	vec3 c = vec3(0.05, 0.01, 0.9); // BG color
	vec3 lightCol = vec3(0.92, 0.3, 0.4);
    
	for(int i = 0; i < 50; ++i) {
        	float t = 0.9 * 5. * float(i) / 4. * fract(time * 0.1);
        	float x = cos(t);
        	float y = sin(t);
        	vec2 o = .5 * vec2(x, y);
        	c += 0.02 / (length(p - o)) * lightCol;
	}
	gl_FragColor = vec4(c,1);
}