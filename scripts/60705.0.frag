precision mediump float;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;
void main(void){
	vec2 pos = surfacePosition;//gl_FragCoord.xy - resolution * 0.5 + vec2(sin(time*10.0),cos(time*10.0))*10.0;
	gl_FragColor = vec4(vec3((sin(length(pos + mouse))*0.5+0.5)),1.0);
}
// illusionary propeller-effect
// try leaning forward and backward while staring at screen