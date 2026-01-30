precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 destColor = vec3(0.0);
    for(float i = 0.0; i < 5.0; i++){
        float j = i + 1.0;
        vec2 q = p + vec2(cos(time * j), sin(time * j)) * 0.5;
        destColor += 0.05 / length(q);
    }
    gl_FragColor = vec4(destColor, 0.5);
}