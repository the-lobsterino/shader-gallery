#ifdef GL_ES
precision mediump float;
#endif
// ogrympic games
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float color = sin(time);
    vec3 destColor = vec3(0.6, 0.2*color, 0.9);
    float rot_time = time * 3.0;
    float f = 0.0;
    for(float i = 1.11; i < 11.11; i++){
        float s = sin(rot_time + i * 1.618) * 0.4;
        float c = cos(rot_time + i * 0.618) * 0.5;
        f += 0.009 / abs(length(p + vec2(c, s)) - 0.33);
    }

    gl_FragColor = vec4(vec3(destColor * f), 0.333);
}