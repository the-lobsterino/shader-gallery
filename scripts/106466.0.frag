#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    

    float catShape = step(uv.y, 0.8) * step(0.2, uv.x) * step(uv.x, 0.8) * step(uv.y, 0.5);
    

    vec3 catColor = vec3(0.0);
    

    vec3 backgroundColor = vec3(0.0, 0.0, 1.0);
    

    vec3 finalColor = mix(backgroundColor, catColor, catShape);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
