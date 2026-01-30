#ifdef GL_ES
precision highp float;
#endif

 
void main() {
    // Distance to nearest point in a grid of
    // (frequency x frequency) points over the unit square
    float frequency = 10.0;
    vec2 nearest = 2.0*fract(frequency * gl_FragCoord.xy/200.) - 1.0;
    float dist = length(nearest);
    float radius = 0.5;
    vec3 white = vec3(1.0, 1.0, 1.0);
    vec3 black = vec3(0.0, 0.0, 0.0);
    vec3 fragcolor = mix(black, white, step(radius, dist));
    gl_FragColor = vec4(fragcolor, 1.0);
}