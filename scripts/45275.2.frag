precision mediump float;
uniform float t; // time
uniform vec2  r; // resolution

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
    vec3 destColor = vec3(0.5, 0.5, 1.0);
    float f = 0.05;
    for(float i = 0.0; i < 6.0; i++){
        float s = sin(t + i * 1.04719) * abs (sin(t));
        float c = cos(t + i * 1.04719) * abs (sin(t));
        f += 0.025 / abs(length(p + vec2(c, s)) -0.25 * abs(sin (t) ));
    	    }
    gl_FragColor = vec4(vec3(destColor * f), 1.0);
}