#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    
    float starSeed = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    vec2 starPosition = fract(uv + starSeed - time * 0.1);
    

    float starBrightness = step(0.98, length(starPosition - 0.5));
    
   
    vec3 skyColor = vec3(0.0, 0.0, 0.2);
    
   
    vec3 finalColor = mix(skyColor, vec3(1.0), starBrightness);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
