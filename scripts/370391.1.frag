#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main() {
    // Coordonnées du centre de l'écran
    vec2 center = u_resolution / 2.0;
    
    // Rayon du cercle
    float radius = 0.2 * min(u_resolution.x, u_resolution.y);
    
    // Calcul des coordonnées du fragment par rapport au centre
    vec2 fragCoord = gl_FragCoord.xy;
    float distance = length(fragCoord - center);
    
    // Si le fragment est à l'intérieur du cercle, colorer en rouge, sinon en noir
    if (distance < radius) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Rouge
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Noir
    }
}
