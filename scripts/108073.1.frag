#ifdef GL_ES
precision mediump float;
#endif

precision mediump float;
uniform float time; // Uniform-Variable für die Zeit.
uniform vec2 resolution;

// Feste Geschwindigkeit für die Bewegung der Farbkeile.
// Ändern Sie diesen Wert, um die Geschwindigkeit zu erhöhen oder zu verringern.
const float speed = -0.05; // vor die Zahl ein Minus und dann geht das ganze in die andere richtung 

const float numSteps = 10.0; // Anzahl der Farbstufen.

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    // Modifizieren Sie die uv.x-Koordinate, um die Farbkeile nach links zu verschieben.
    uv.x -= time * speed;

    // Wiederholen Sie die Farbkeile, wenn sie links aus dem Bild laufen.
    uv.x = mod(uv.x, 1.0);

    float stepSize = 1.0 / numSteps;
    float stepIndex = floor(uv.x / stepSize);
    vec3 color = vec3(0.2); // Dunkelgrauer Hintergrund.

    // Umkehrung der Farbabfolge, sodass dunkel links und hell rechts ist.
    float colorIntensity = stepIndex / (numSteps - 1.0);

    // Farbbalken in Grau (oben)
    if (uv.y < 0.25) {
        color = vec3(colorIntensity);
    }
    // Farbbalken in Rot
    else if (uv.y >= 0.25 && uv.y < 0.5) {
        color = vec3(colorIntensity, 0.0, 0.0);
    }
    // Farbbalken in Grün
    else if (uv.y >= 0.5 && uv.y < 0.75) {
        color = vec3(0.0, colorIntensity, 0.0);
    }
    // Farbbalken in Blau (unten)
    else if (uv.y >= 0.75) {
        color = vec3(0.0, 0.0, colorIntensity);
    }

    gl_FragColor = vec4(color, 1.0);
}
