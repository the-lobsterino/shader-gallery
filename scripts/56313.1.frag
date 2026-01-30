#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

void main(){
    
    vec2 st = gl_FragCoord.xy/resolution.xy;

    float dist = distance(st, vec2(0.5));

    float height = sin(exp((dist + sin(time * 1.0) *  0.5 ) * 10.0));

    gl_FragColor = vec4(vec3(height), 1.0);

}