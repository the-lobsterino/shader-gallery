// Conway's game of life

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void )
{
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 pixel = 1.0/resolution;
	float selection_size = 100.0;
	vec2 mouse_fix = pixel * (selection_size / 2.0);
	mouse_fix.x *= -1.0;
	vec2 fixed_mouse_pos = mouse + mouse_fix;
	vec2 relative_pos = position - fixed_mouse_pos;
	float pixel_space_length = length(relative_pos*resolution);

	float life = texture2D(backbuffer, position).b;
	
	// Add in selection area
	if (pixel_space_length < selection_size)
	{
		float l = pixel_space_length / selection_size;
		float alive = 1.0 - (l*l);
		life = max(life, alive);
	}
	// Fade
	life *= 0.95;
	if (life >= 0.05)
	{
		gl_FragColor = vec4(life * 3.0, life * 2.0, life, 1.0);
	}
	else
	{
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
}