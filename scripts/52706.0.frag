#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

    // 中心となる太陽
    vec2 position  = (gl_FragCoord.xy * 2.5 - resolution) / min(resolution.x, resolution.y);
    float sun      = 0.25 / abs(length(position));
    gl_FragColor  += vec4(vec3(sun, sun / 2.0, 0.0), 1.0);
    // 惑星の軌道
    float skyblue  = 0.005 / abs(length(position) - 0.5);
    gl_FragColor  += vec4(vec3(skyblue / 5.0, skyblue / 2.5, skyblue), 1.0);
    // 惑星本体
    float zahyo_1  = 0.5;
    vec2 planet_position = vec2(position.x - sin(time) * zahyo_1, position.y - cos(time) * zahyo_1);
    float planet_1 = 0.075 / abs(length(planet_position));
    gl_FragColor  += vec4(vec3(planet_1 / 2.0, planet_1 / 1.5, planet_1), 1.0);
    // 衛星の軌道
    float skyblue_2  = 0.005 / abs(length(planet_position) - 0.2);
    gl_FragColor  += vec4(vec3(skyblue_2 / 5.0, skyblue_2 / 2.5, skyblue_2), 1.0);
    // 衛星
    float zahyo_2  = 0.2;
    vec2 satellite_position = vec2(planet_position.x - sin(time * 2.5) * zahyo_2, planet_position.y - cos(time * 2.5) * zahyo_2);
    float satellite_1 = 0.025 / abs(length(satellite_position));
    gl_FragColor  += vec4(vec3(satellite_1, satellite_1 / 2.5, satellite_1 / 2.5), 1.0);

}