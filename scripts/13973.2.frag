#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = (gl_FragCoord.xy / resolution.xy);
	pos.y -= 0.5;
	pos.y += sin(pos.x * 1.0 + time) * 0.2;
	vec3 color = vec3(1.0-pow(abs(pos.y), 0.2)); 
	
	gl_FragColor = vec4(color, 1.0);
}