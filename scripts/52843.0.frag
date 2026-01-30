#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

    // Sun
    vec2 position  = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float sun      = 0.25 / abs(length(position));
    gl_FragColor  += vec4(vec3(sun, sun / 300.0, 0.0), 1.0);
    // Orbit
    float skyblue  = 0.0005 / abs(length(position) - 0.5);
    gl_FragColor  += vec4(vec3(skyblue / 0.5, skyblue / 0.5, skyblue), 1.0);
    // planet
    float orbit_1  = 0.5;
    vec2 planet_position = vec2(position.x - sin(time) * orbit_1, position.y - cos(time) * orbit_1);
    float planet_1 = 0.075 / abs(length(planet_position));
    gl_FragColor  += vec4(vec3(planet_1 / 220.0, planet_1 / 1.5, planet_1), 1.0);
    

}