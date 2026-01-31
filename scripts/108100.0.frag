#ifdef GL_ES
precision mediump float;
#endif

precision mediump float;
uniform float time; // Zeit-Uniform, bereits von GLSL Sandbox bereitgestellt.
uniform vec2 resolution;

// Geschwindigkeitskonstante für die Bewegung des Graukeils.
// Negative Werte bewegen den Keil nach links, positive nach rechts.
const float speed = -0.03; // Ändern Sie diesen Wert, um die Geschwindigkeit anzupassen.

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    // Die Zeitvariable beeinflusst die horizontale Koordinate, um den Keil zu verschieben.
    uv.x += time * speed;

    // Modulo-Operation sorgt dafür, dass der Graukeil wiederholt wird, wenn er aus dem Bild läuft.
    uv.x = mod(uv.x, 1.0);

    // Die Anzahl der Segmente bestimmt die Anzahl der Helligkeitsstufen.
    float numSteps = 1024.0; // Verwenden Sie 1024 für 10-Bit-Helligkeitsstufen.
    float stepSize = 1.0 / numSteps;
    float stepIndex = floor(uv.x / stepSize);
    float color = stepIndex / (numSteps - 1.0); // Helligkeitsstufen von 0.0 bis 1.0

    gl_FragColor = vec4(vec3(color), 1.0);
}
