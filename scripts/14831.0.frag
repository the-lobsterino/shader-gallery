#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
void main() {
	
	    vec2 uv = gl_FragCoord.xy / (resolution.xy);
    float c = mod(uv.x, 0.5);
    float d = mod(uv.y, 0.5);
    gl_FragColor = vec4(c, d, 0.0, 1.0);
}