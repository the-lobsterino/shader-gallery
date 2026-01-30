#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

float pi = 3.14159265;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float tw()
{
	return sin(time*pi/3.) * 0.5 + 0.5;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position.x -= 0.5;
	position.y -= 0.5;
	position.x *= resolution.x / resolution.y;

	
	float theta = atan(position.y, position.x);
	//float angle_pos = theta / (2.0 * pi) + 0.5;
	float r = length(position) * 1.*(tw() - 0.5);
	
	float v;
	//float t = time;
	float t = (1.0-tw())*4.;
	if (mod(r + t / 2.0 + (theta / 2.0) / pi, 0.2) < 0.1) { v = 1.0; } else { v = 0.0; }
	
	gl_FragColor = vec4(v/4., 0.0, v, 1.0);

}