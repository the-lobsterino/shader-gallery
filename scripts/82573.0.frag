#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main(void) {
    vec2 R = resolution.xy;
	float d = sin(.5*time*(length(floor((2.*gl_FragCoord.xy - R)/R.y * 20.))));
    gl_FragColor = vec4( vec3(d>0.),1.);
}