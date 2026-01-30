#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float pi = 3.14159;
	

	vec2 position = gl_FragCoord.xy / resolution.y;
	position -= 0.5*resolution/resolution.y;
	position *= 0.5;
	

	float red, blue;
	red = blue = 0.0;
	
	
	float a = tan(time);
	vec2 factor = vec2(1, a);
	float x_min = dot(position, factor) / length(factor)*length(factor);
	float d_min = 2. * length(factor) * length(factor) * x_min * x_min - 2. * dot(position, factor) * x_min + length(position) * length(position);
	
	float epsilon = 0.005;
	float border_width = 0.5;
	float outer_epsilon = epsilon * (1. + border_width);
	
	if (-epsilon < d_min && d_min < epsilon)
		blue = 1.0;
	else if (-outer_epsilon < d_min && d_min < outer_epsilon)
	{
		float alpha = 0.5 * pi / (epsilon - outer_epsilon);
		float beta = -outer_epsilon * alpha;
		blue = sin(alpha * length(position) + beta);
	}
	
	
	float radius = 0.02;
	border_width = 0.5;
	float outer_radius = radius * (1. + border_width);	
	
	if (length(position) < radius)
		red = 1.0;
	else if (length(position) < outer_radius)
	{
		float alpha = 0.5 * pi / (radius - outer_radius);
		float beta = -outer_radius * alpha;
		red = sin(alpha * length(position) + beta);
	}
	

	gl_FragColor = vec4( red, 0 , blue, 1.0 );

}