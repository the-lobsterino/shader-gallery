#ifdef GL_ES
precision mediump float;
#endif

precision mediump float;
uniform float time;
uniform vec2 resolution;

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float c = 0.0;
    c += sin((p.x*p.x+p.y*p.y)*16.0*pow(time,3.));
    gl_FragColor = vec4(vec3(c), 1.0);
}