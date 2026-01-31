precision mediump float;

uniform float time;
uniform vec2 resolution;

void main() {
    // Coordonnées normalisées de l'écran
    vec2 p = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.y, resolution.x);

    // Animation de l'eau en fonction du temps
    float waterHeight = 0.5 + 0.1 * sin(time);

    // Couleur de l'eau
    vec3 waterColor = vec3(0.0, 0.5, 1.0);

    // Définir la couleur de l'eau en fonction de la hauteur
    if (p.y < waterHeight) {
        gl_FragColor = vec4(waterColor, 1.0);
    } else {
        // Partie supérieure de l'écran (ciel)
        vec3 skyColor = vec3(0.53, 0.81, 0.98);
        gl_FragColor = vec4(skyColor, 1.0);
    }
}
