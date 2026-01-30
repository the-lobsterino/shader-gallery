#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 resolution;

void main(void) {
	float d = sin(.6*time*(length(((6.*gl_FragCoord.xy - resolution.xy)/resolution.y * 5.))));
    gl_FragColor = vec4( d,0,.0,1.);
}