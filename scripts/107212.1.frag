#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 iResolution;
uniform vec2 iMouse; // Posizione del rilevatore di movimento
uniform float iGlobalTime;

void main() {
    vec2 st = gl_FragCoord.xy/iResolution.xy;
    vec2 toMouse = iMouse.xy/iResolution.xy - st;
    
    float dist = length(toMouse);
    float wave = sin(dist * 1.0 - iGlobalTime * 5.0) * 0.50;
    
    wave = wave / (dist + 1.1); // Decadimento dell'onda
    
    vec3 color = vec3(0.0, 0.0, 1.0 + wave); // Colore blu
    
    gl_FragColor = vec4(color,1.0);
}
