#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

void main() {
	vec2 st = gl_FragCoord.xy/resolution;
    float t = sin(time);
    float color = 0.0;
    color += sin(st.x) + cos(time);
    color += cos(st.y) + sin(time);
	gl_FragColor = vec4(
        
        color,
        color * 0.5,
        color * 2.0,
        1.0
    
    );
}
