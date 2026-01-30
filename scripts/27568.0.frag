#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 mpos = (resolution.xy * mouse.xy);
	vec2 pos = gl_FragCoord.xy;
	float offset = 25.0;
	float size = 5.0;
	
	// Make the graph setup
	if(gl_FragCoord.x < offset || gl_FragCoord.y < offset)
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	
	// Make the graph shower
	if(pos.y >= offset && pos.x >= offset)
	{
		if(pos.x < mpos.x + size && pos.x > mpos.x - size && pos.y <= mpos.y + size 
		   || pos.x <= mpos.x - size && pos.y <= mpos.y + size && pos.y >= mpos.y - size && pos.x <= mpos.x - size)
		{
			gl_FragColor = vec4(mouse.y * 2.0, mouse.x * 2.0, 0.0, 1.0);
		}
		if(pos.x < mpos.x - size && pos.y < mpos.y - size)
			gl_FragColor = vec4(mouse.y * 0.5, mouse.x * 0.5, 0.0, 1.0);
	}
}