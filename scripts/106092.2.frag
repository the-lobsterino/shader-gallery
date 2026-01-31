precision mediump float;

uniform float time;
uniform vec2 resolution;

void main() {
    // Coordonnées normalisées de l'écran
    vec2 p = (4.0 * gl_FragCoord.xy - resolution) / min(resolution.y, resolution.x);
	vec2 p2 = ( gl_FragCoord.xy/resolution.xy);
p.y*=p.y-0.005;p2.y*=-1.25;
    // Animation de l'eau en fonction du temps and x-coordinate
    float waveAmplitude = 0.1; // Adjust the amplitude of the waves
    float waveFrequency = 1.0; // Adjust the frequency of the waves
    float waterHeight = 0.5 + (waveAmplitude * sin(time + p.x * waveFrequency));
    float waterHeight2 = 0.5 + 0.1 * sin(time);
    // Couleur de l'eau
    vec3 waterColor = vec3(0.0, p.y*0.95, .850);

    // Définir la couleur de l'eau en fonction de la hauteur
  if (p.y < waterHeight      && p.y < waterHeight2) {
  gl_FragColor += vec4(waterColor, 1.0);
  gl_FragColor += vec4(5.*p2.y*waterColor, 1.0);
   } else {
       // Partie supérieure de l'écran (ciel)
       vec3 skyColor = vec3(p.y*0.003,0.,p.y*0.004);
       gl_FragColor += vec4(skyColor, 1.0);
    }
}
