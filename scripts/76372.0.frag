#extension GL_OES_standard_derivatives : disable

precision mediump float;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv.x *=  resolution.x/resolution.y;
	
	float glow_r = 1.0;
	float glow_g = 0.0;
	float glow_b = 1.0;
	vec4 color;
	
	float line_m = 0.55;
	float line_b = -0.03;
	float line_width = 0.02;
	float glow_width = 0.7;
	
	float intersect_for_uvx = ( line_m * uv.x ) + line_b;
	float distance_to_intersect = abs(intersect_for_uvx - uv.y);
	if(distance_to_intersect < line_width) {
		color = vec4(1.0, 1.0, 1.0, 1.0);
	} else if(distance_to_intersect > glow_width) {
		color = vec4(0.0, 0.0, 0.0, 1.0);
	} else {
		float glow_percentage = (glow_width - line_width - distance_to_intersect) / (glow_width - line_width);
		color = vec4(
		  glow_r * glow_percentage,
		  glow_g * glow_percentage,
		  glow_b * glow_percentage,
		2.0);
	}
	
	gl_FragColor = color;
}
