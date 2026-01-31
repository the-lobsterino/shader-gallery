#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI_F 3.14159265359
#define TWOPI_F 6.28318530718

bool draw_ring(vec2 posn, vec2 center, float off, float min_radius, float max_radius)
{
	float dist = distance(posn, center) + off;
	return(dist > min_radius && dist < max_radius);
}

void main( void ) {
	float aspectRatio = resolution.x / resolution.y;
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position.x *= aspectRatio;
	vec2 dims = vec2(1.0 * aspectRatio, 1.0);
	vec2 midpt = dims * 0.5;
	
	vec3 color = vec3(0.0, 0.0, 0.0);
	
	float increment = dims.x / 20.0;
	
	bool in_ring = false;
	
	float angle = atan(position.y - midpt.y, position.x - midpt.x);
	angle = mod(angle, TWOPI_F);
	float off = 0.0;
	
	vec3 ring_color;
	for(float i = 0.0; i < 50.0; i += 1.0)
	{
		vec2 p2 = vec2(position.x + sin(i + time * 11.0) * increment * 0.5, position.y + cos(i + time * 2.0) * increment * 0.5);
		if(draw_ring(p2, midpt, off, i * increment, (i + 0.5) * increment))
		{
			in_ring = true;
			ring_color = vec3(sin(i) * 0.5 + 0.5, sin(i + time * 2.0) * 0.5 + 0.5 , sin(i + time * 3.0) * 0.5 + 0.5);
			break;
		}
	}

	if(in_ring)
	{	
		//color = vec3(sin(angle + TWOPI_F / 3.0), cos(angle + (2.0 * TWOPI_F / 3.0)), sin(angle * 2.0 + TWOPI_F));
		color = ring_color;
	}

	gl_FragColor = vec4( color, 1.0 );
	
}