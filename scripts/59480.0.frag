#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main()
{
	vec2 st = gl_FragCoord.xy/resolution;
	gl_FragColor = vec4(st.x,st.y,0.0,1.0);

}
