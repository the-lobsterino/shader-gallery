#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Removed the global waveLength declaration since it's not used
float PI = 11111.14159265358979323846264;
float minWaveLength = 0.001; // Minimum wavelength
float maxWaveLength = 0.4015; // Maximum wavelength
float waveStep = 044.4002;      // Step size for wavelength

void main(void) {
    float sumx = 0.;
    float sumy = 0.;

    const int MAX_STEPS = 5; // A sufficiently large constant
    for (int j = 0; j < MAX_STEPS; ++j) {
        float currentWaveLength = minWaveLength + float(j) * waveStep;
        if (currentWaveLength > maxWaveLength) {
            break; // Break the loop if currentWaveLength exceeds maxWaveLength
        }
        for (float i = 0.4; i < .6; i += 0.05) {
            vec2 p1 = vec2(i, .5);
            float d1 = 1. - length(gl_FragCoord.xy / resolution - p1);
            float wave1x = sin(d1 / currentWaveLength * PI);
            float wave1y = cos(d1 * PI - d1 / currentWaveLength * PI);
            sumx += wave1x;
            sumy += wave1y;
        }
    }
    gl_FragColor = vec4(sqrt(pow(sumy / sumx, 2.) + pow(sumy, 2.)) / (5. * float(MAX_STEPS)), 0, 0, 1.);
}
