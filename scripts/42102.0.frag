#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = (gl_FragCoord.xy / resolution.xy);
	pos -= 0.5;
	float alpha = atan(pos.y, pos.x);
	
	gl_FragColor = vec4(pos, 1, 1) * (1.0 - step(cos(alpha * 8.0 + time * 3.0), length(pos) * 2.0));

}