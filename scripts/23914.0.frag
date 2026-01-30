#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	
	//if((gl_FragCoord.y/resolution.y) - mouse.y < 0.1 && (gl_FragCoord.y/resolution.y) - mouse.y > 0.0)
	//	gl_FragColor = vec4( vec3(mouse.y, mouse.y, mouse.y), 1);
	
	vec2 relative_coord = gl_FragCoord.xy/resolution.xy;
	
	float mouse_distance = sqrt(pow((relative_coord.x - mouse.x), 2.0) + pow((relative_coord.x - mouse.y), 2.0));
	
	if(mouse_distance < 0.1)
		gl_FragColor = vec4( vec3(mouse.y, mouse.y, mouse.y), 1);
}