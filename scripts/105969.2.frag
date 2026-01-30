#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 color = vec3(0.0);
    
    for(int i = 0; i < 100; i++) {
        vec2 starPosition = vec2(sin(float(i) * 654.32) * 0.5 + 0.5, cos(float(i) * 983.21) * 0.5 + 0.5);
        float flicker = sin(time * 10.0 + float(i) * 10.0) * 0.5 + 0.5;
        float starBrightness = smoothstep(0.02, 0.03, 0.03 - length(starPosition - uv)) * flicker;
        color += vec3(starBrightness);
    }
    
    gl_FragColor = vec4(color,1.0);
}
