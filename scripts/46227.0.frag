#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
    vec2 p = gl_FragCoord.xy / resolution.x * 0.7;
    vec3 col;
    float t = time * mouse.x;
    for(float j = 0.0; j < 3.0; j++){
        for(float i = 1.0; i < 30.0; i++){
            p.x += 0.1 / (i + j) * sin(i * 10.0 * p.y + t + cos((time / (12. * i)) * i + j));
            p.y += 0.1 / (i + j)* cos(i * 10.0 * p.x + t + sin((time / (12. * i)) * i + j));
        }
        col[int(j)] = abs(p.x + p.y);
    }
    gl_FragColor = vec4(col, 1.);
}