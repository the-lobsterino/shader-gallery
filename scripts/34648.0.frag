#ifdef GL_ES
precision mediump float;
#endif

 float time=0.;

uniform vec2 resolution;

#define PI 3.14159265359
#define T (time * 6.)

float square(float x) {
	return sign(sin(x));
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	position.x *= resolution.x / resolution.y;

	float a = 0.;
	for (float i = 1.; i <= 12.; i++)
	{
		float p = pow(2., i)-fract(sin(time)*i);
		a += sin(p * 2. * PI * (position.x*2.0) - T) / p;
	}
	
	a = fract(sin(time*.1)/a)+(0.1 + 0.1*a) * ( 0.3 / abs(position.y - 0.025*a));
	
	float b = 0.;
	
	for (float i = 1.; i <= 6.; i++)
	{
		float p = pow(4., i);
		b += cos(p * 2. * PI * (position.x) - 2.0*T) / p;
	}
	
	b = (0.15 + 0.2*b) * ( 0.1 / abs(position.y - 0.045*b));
	
	vec3 result = a * vec3(0.015, 0.05, 0.32) + b * vec3(0.175, 0.05, 0.5);

	gl_FragColor = vec4( result, 1.0 );

}