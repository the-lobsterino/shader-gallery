#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 resolution;

void main(void) {
    vec2 R = resolution.xy;
	float d = cos(.2*time*(length(floor((1.*gl_FragCoord.xy - R)/R.y * 1000.))));
    gl_FragColor = vec4( d,d-sin(time),.1,1.);
}