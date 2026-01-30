#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main(){
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	
	float tx = (position.x + 0.075) * 1.0;
	float ty = (position.y) * 10.0;
	float r = ((cos((time * 10.0 + sin(tx) * 500.0 + sin(ty) * 100.0) / 6.0) + 1.0) * 0.5 + 0.5) / 5.0;
	float b = ((sin((time * 10.0 + sin(tx) * 200.0 + sin(ty) * 50.0) / 6.0) + 1.0) * 0.5 + 0.5) / 5.0;
	
	gl_FragColor = vec4(r, 0.1, b, 1);
}