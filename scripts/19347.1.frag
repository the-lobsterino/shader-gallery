#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	vec2 pos = (gl_FragColor.xy / resolution) * 2.0 - 1.0;
	vec3 color = vec3(0.0, 0.0, 0.0);
	color += pos.y + 0.5 * sin(pos.x + time);
	
	gl_FragColor = vec4(color, 1.0);
}