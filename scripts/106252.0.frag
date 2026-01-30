precision mediump float;
}
vec4 color = vec4(1.);
vec2 pitch  = vec2(50., 50.);

void main() {    
    if (mod(gl_FragCoord.x, pitch[0]) < 1. ||
        mod(gl_FragCoord.y, pitch[1]) < 1.) {
        gl_FragColor = color;
    } else {
        gl_FragColor = vec4(0.);
    }
}