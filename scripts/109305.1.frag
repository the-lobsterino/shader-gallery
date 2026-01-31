#extension GL_OES_standard_derivatives : enable

precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

void main(void){
    vec2 m = vec2(mouse.x * 2.0 - 1.0, mouse.y *2.0- 1.0);
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float lambda = time*2.5;

    //float t =0.02/abs(tan(lambda) - length(p))
    float u = sin((atan(p.y, p.x) - length(p)) * 5. +  time*2.)*0.3  + 0.2 ;
    float t = 0.01 / abs(0.5 + u - length(p));

    vec2 something = vec2(0.0,1.);
    float dotProduct = dot(vec2(t),something)/length(p);

    gl_FragColor = vec4(tan(dotProduct),0,sin(t), 1.);
}
//elijah