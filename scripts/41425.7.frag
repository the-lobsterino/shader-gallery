#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


/*
// iq's sdfs

// sdfsphere
float sc(in vec2 position, in float radius) {
	return length(position)-radius;
}

// sdfbox
float sb(in vec2 position, in float radius) {
	return length(max(abs(position)-vec2(radius),0.0));
}
*/


// metacircle
float mc(in vec2 position, in float radius) 
{
    	return (radius * radius) / (position.x * position.x + position.y * position.y);
}

// metabox
float mb(in vec2 position, in float radius) 
{
	return radius / (max(abs(position.x),abs(position.y)));
}

// metadiamond
float md(in vec2 position, in float radius) 
{
    	return radius / (abs(position.x) + abs(position.y));
}


void main( void ) {

	// fixing resolution
	float y_offset = (resolution.x - resolution.y) * 0.5;
	vec2 uv = vec2(
		gl_FragCoord.x / resolution.x,
		(gl_FragCoord.y + y_offset) / resolution.x
	);	
	vec2 mouse_position = vec2(
		mouse.x, 
		((mouse.y * resolution.y) + y_offset) / resolution.x
	);
	
    
    	// actual things
    	const float radius = 0.02;
	const float dist = 0.06;
	
    	vec2 rotator_1 = vec2(cos(-time) * dist, sin(-time) * dist);
	vec2 rotator_2 = vec2(sin(time) * dist, cos(time) * dist);
	
	float p1 = mc(mouse_position + rotator_1 - uv, radius);
	p1 += mc(mouse_position - rotator_1 - uv, radius);
	p1 += mc(mouse_position + rotator_2 - uv, radius);
	p1 += mc(mouse_position - rotator_2 - uv, radius);
	
    	float p2 = md(mouse_position - uv, radius);
	
	if (p1 + p2 > 1.0) { gl_FragColor = vec4(p2, p1, p2+p1, 1.0); } else { gl_FragColor = vec4(0.0); }
	
}