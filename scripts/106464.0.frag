#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    // Aggiungi movimento alle stelle utilizzando il tempo
    uv += vec2(time * 0.01, 0.0);
    
    // Genera un effetto di stelle casuali
    float stars = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    
    // Scegli un colore per le stelle (bianco o nero)
    vec3 starColor = mix(vec3(1.0), vec3(0.0), stars);
    
    // Rendi il cielo più scuro
    vec3 skyColor = vec3(0.05);
    
    // Mescola il colore del cielo con il colore delle stelle
    vec3 finalColor = mix(skyColor, starColor, stars * 0.5);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
