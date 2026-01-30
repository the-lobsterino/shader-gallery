#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy/resolution.x;
    vec2 mouseUv = uv - vec2(mouse.x, mouse.y * 0.5);
    
    vec3 col = vec3(1.0, 0.4, 0.1);
    col *= smoothstep(0.95, 1.0, 1.0-length(mouseUv));
    
    gl_FragColor = vec4(col, 1.0);
}