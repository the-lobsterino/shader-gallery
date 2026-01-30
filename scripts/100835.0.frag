precision mediump float;

vec4 color = vec4(1);
vec2 pitch  = vec2(20, 20);

void main() {    
    if (int(mod(gl_FragCoord.x, pitch[0])) == 0 ||
        int(mod(gl_FragCoord.y, pitch[1])) == 0) {
        gl_FragColor = vec4(0.8,0.8,0.8,1);
    } else {
        gl_FragColor = vec4(1,1,1,1);
    }
}