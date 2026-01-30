#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 destColor = vec3(0.0);
    float r = 0.0;
    float g = 0.0;
    float b = 0.0;
    for(float i = 0.0; i < 500.0; i++){
        float j = i + 0.1;
        float v =  sin(i) + 1.3 ;
        vec2 q = p + vec2(cos(time * j / 1000.0), sin(time * j / 1000.0)) * v;
        r +=  0.0;
        g += 0.001 / length(q) * 0.7;
        b += sin(0.60 / length(q) * 1.2);
    }
    gl_FragColor = vec4(vec3(r,g,b), 1.0);
}