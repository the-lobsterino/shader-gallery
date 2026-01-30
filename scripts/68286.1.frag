//
// This algorithm shall henceforth be known as "The Mandelswirl"™.
//
// If you don't like the name, tough luck.
//
// Look through previous versions to see variations.
//

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
const float ZOOM = 35.0;
const float SPEED = 0.1;
const float SW_ITERATIONS = 10.;
const float MB_ITERATIONS = 10.;

#define PI 3.1415

float mandelbrot(vec2 c) {
	vec2 z = c;
	vec3 color = vec3(.0);
	float t = time * SPEED;
	//t = 0.; // Add this assignment if you don't like the distortions.
	for (float i = 0.; i < MB_ITERATIONS; i++)
	{
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) - z*cos(t) + c*sin(t);
		if (length(z) > 2.0) {
			break; // Comment this out if you want points outside the MB set to be colored by complex modulus instead.
			return i / MB_ITERATIONS * 1.5;
		}
		color += exp(abs(sin(t)) - vec3(z.x, z.y, length(z)));
	}
	// Return the final angle, instead of iteration count as with most techniques.
	// This will give you smoother transitions.
	return (atan(z.y, z.x) / PI  + 1.0)/color.z* MB_ITERATIONS * .45; 
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy - resolution / 2.0) / resolution * ZOOM;
	float f = mandelbrot((p + vec2(3.25, 0.)) * .075);
	for(float i = 0.; i < SW_ITERATIONS; i += 1.0) {
		p.x += 0.0155 * i * sin(p.y + f) + cos(f + time * SPEED);
		p.y += 0.0155 * i * sin(p.x - f) + sin(f + time * SPEED);
		f = mandelbrot((p + vec2(3.25, 0.)) * .1);
	}
	gl_FragColor = vec4(cos(p.x), sin(p.y), sin(p.x), 1.0);
}