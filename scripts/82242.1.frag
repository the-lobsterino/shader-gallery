precision mediump float;

uniform float time;
uniform vec2 resolution;


vec4 color = vec4(.2,.5,.5,1);
vec2 pitch  = vec2(3, 3);

void main() {
    vec2 pos = ( gl_FragCoord.xy / resolution.xy );
    vec4 color = vec4(pos.x, pos.y, (sin(time / 5.0) + 1.0) * .5, 1.0);
    vec2 pitch = vec2(int((sin(time) + 1.0) * 10.0));
    gl_FragColor = (int(mod(gl_FragCoord.x, pitch[0])) == 0
		 || int(mod(gl_FragCoord.y, pitch[1])) == 0)
        ? color
        : vec4(0);
}