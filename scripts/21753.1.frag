#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float y;
vec4 Color;

void main(){
	Color = vec4(0,0,0,1);
	int i = int(gl_FragCoord.x);
	y = mouse.y*resolution.y + sin((time+gl_FragCoord.x))*mouse.x*resolution.y/2.5;
	if (int(gl_FragCoord.y) == int(y))
		Color = vec4(0.2,1,0.2,0.6+cos((time+gl_FragCoord.x))/3.);
	gl_FragColor = vec4(Color);
}