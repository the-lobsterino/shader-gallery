//c64 version by juhaxgames
precision lowp float;
uniform float time;
uniform vec2 resolution;
#define READY vec2 p0400 =(gl_FragCoord.xy/resolution.xy);float color = sin(p0400.x*p0400.x+time)-p0400.y*6.0+2.0;
#define sys4096 gl_FragColor = vec4( vec3( color * 0.5, color * 0.4,0.5 ), 1.0 );
void main(){
READY
sys4096
}