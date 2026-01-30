// GLSL simple 2D wave by Kiomarou @_@

#ifdef GL_ES
precision highp float;
#endif

// fetch
uniform vec2 resolution;
uniform float time;

// vars
float lambda = 70.;
float mag = 1.;
float renderOffset = .5;
float intensity = 1.;
float peakBias = 0.2;
vec3 colour = vec3(1., 1., 1.);

void main(void) {
    float x = mag - length(gl_FragCoord.xy/resolution - renderOffset);

    // make wave
    float wave = sin(x*lambda-time*50.)-peakBias;
    
    // alter value
    float value = intensity*-wave;
    
    // colourise
    colour = vec3(sin(time) / 10., -cos(time/2.), cos(time));
    vec3 colour = vec3(value)*colour;
    gl_FragColor = vec4(colour,1.);
}