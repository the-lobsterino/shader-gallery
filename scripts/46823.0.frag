#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void){

    vec2 p = (gl_FragCoord.xy * (-0.5) - resolution) / min(resolution.x, resolution.y);
    vec3 destColor = vec3(1.0, 1.0, 1.9);
    float f = 0.0;
    for(float i = 0.0; i < 1000.0; i++){
        float s = sin(time + i * 9.0)    * 0.5;
        float c = cos(time + i * 7.0) * 0.5;
        f += 0.00002/ abs(length(p + vec2(c, s)) - 2.87);
    }
   
    gl_FragColor = vec4(vec3(destColor * f), 1.0);
}