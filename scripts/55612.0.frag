#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float color = sin(time);
    vec3 destColor = vec3(0.0, 0.3*color, 0.7);
    float rot_time = time * 3.0;
    float f = 0.0;
    for(float i = 0.0; i < 10.0; i++){
        float s = sin(rot_time + i * 0.628318) * 0.5;
        float c = cos(rot_time + i * 0.628318) * 0.5;
        f += 0.0025 / abs(length(p + vec2(c, s)) - 0.5);
    }

    gl_FragColor = vec4(vec3(destColor * f), 1.0);
}