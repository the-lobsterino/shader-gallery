#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float give_color(float angle) {
	return pow(cos(angle),2.);
}

float remainder(float a, float b){
	return a - b * ceil(a / b);
}

void main( void ) {

	const float pi = 3.14159;
	
	
	vec2 position = gl_FragCoord.xy / resolution.y;
	position -= 0.5 * resolution.xy / resolution.y;
	position *= 1.;
	
	
	float angle = 5.*length(position);
	vec3 color = vec3(give_color(angle), give_color(angle + pi/3.), give_color(angle - pi/3.));
	
	
	float intensity = 0.;
	
	const float radius = .03;
	float speed = radius * 1.; // per second
	const float n = 20.;
	const float m = 1.5 / (4. * radius);
	
	for(float j=0.; j < 2. * n; ++j)
	{
		for (float i=0.; i < m; ++i)
		{
			float x = 4. * radius * (i + 1.);
			float offset = remainder(speed*time, 4.*radius);
			x += offset;
			
			float theta = j * pi / n;
			vec2 center = x * vec2(cos(theta), sin(theta));
			if (length(position - center) < radius)
				intensity = max(intensity, cos(length(position - center)*0.5*pi/radius));
		}
	}
	
	color *= intensity;
	
	
	vec2 center = (mouse - 0.5) * resolution / resolution.y;
	if (length(position - center) < 0.005)
	{
		float angle = time;
		color = vec3(give_color(angle), give_color(angle + pi/3.), give_color(angle - pi/3.));
	}
	else if (length(position - center) < 0.006)
		color = vec3(1,1,1);
		
	
	gl_FragColor = vec4( color, 1.0 );

}