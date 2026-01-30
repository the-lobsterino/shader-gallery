#ifdef GL_ES
precision mediump float;
#endif



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
   gl_FragColor = vec4(0.0,length(cos(sin(time))*tan(fract(time)))-time/90.0,length(gl_FragCoord.y)-gl_FragCoord.x,length(gl_FragCoord));
}