precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 destColor = vec3(1.0, 0.3, 0.7);
    float f = 0.0;
    for(float i = 0.0; i < 40.0; i++){
        float s = (sin(time + i * 0.68/8.) *  0.5);
        float c = sin(cos(time + i * 0.628318/2.) * sin(time*0.5));
        f += (0.0025 / abs(length(p + vec2(c, s)) - .5));
    }
    gl_FragColor = vec4(vec3(destColor * f), 1.5);
}