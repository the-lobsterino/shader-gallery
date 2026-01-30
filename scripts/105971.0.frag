#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
    vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float color = 0.0;
    float centerDist = length(position);
    
    for (int i = 0; i < 50; i++) {
        vec2 offset = vec2(sin(float(i) * 0.1 + time + sin(time * 0.1 + float(i) * 0.2)) * 2.0, 
                           cos(float(i) * 0.15 + time + cos(time * 0.15 + float(i) * 0.1)) * 2.0);
        float dist = length(position - offset);
        color += exp(-dist * dist * 40.0) * exp(-centerDist * centerDist * 4.0);
    }
    
    color = mod(color, 0.5) * 2.0;
    gl_FragColor = vec4(vec3(color, color * 0.5, color * 0.2), 1.0);
}
