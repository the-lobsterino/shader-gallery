precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform float   t; // time
uniform vec2  r; // resolution

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
    vec3 destColor = vec3(0.0);
    for(float i = 0.0; i < 6.0; i++){
        float j = i + 1.0;
        vec2 q = p + vec2(sin(t * j), -cos(t * j)) * 0.5;
        //destColor += 0.05 / length(q);
        destColor += vec3(mod(i,2.0)*0.05,
                          mod(i+1.,2.0)*0.05,
                          0.05) / length(q);
    }
    gl_FragColor = vec4(destColor, 1.0);
}
