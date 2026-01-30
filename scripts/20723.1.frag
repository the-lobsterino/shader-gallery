#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = gl_FragCoord.x * resolution;
	
	vec3 color = vec3(0.0, 0.0, 0.0);
	
	float factor = pos.x * sin(time*1.0 - length(pos)/10.0);
	
	color.x = factor;
	color.y = factor;
	color.z = factor;
	
	gl_FragColor = vec4(color, 1.0);

}