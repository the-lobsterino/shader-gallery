#ifdef GL_ES
precision mediump float;
#endif

// --- System ---
uniform float time;
uniform vec2 resolution;

void main() {
    vec2 p0 = gl_FragCoord.xy / min(resolution.x, resolution.y) - vec2(0.5, 0);
	
	float d = length(p0 - vec2(0.1, 0.7));
	
	d = 0.152 / d;
	
    
    gl_FragColor = vec4(d, d, d, 1.0);
}
