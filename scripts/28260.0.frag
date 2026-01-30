#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359
#define PI2 (PI*2.)
#define T (time/2.)
#define IMAX 4.
#define JMAX 4.

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - 0.5);
	position.x *= resolution.x / resolution.y;
	
	vec3 color = vec3(0.);
	
	
	for (float j = 0.; j < 4.; j++) { 
	for (float i = 0.; i < IMAX; i++) {
		float a = ((i + (j / JMAX)) / IMAX) * PI2;
		vec2 p = position - vec2(cos(a+T*(j+1.)), sin(a+T*(j+1.))) * 0.25;
		vec3 col = hsv2rgb(vec3((a)/(PI*2.), 1., 1.));
		color += col * (1./128.) / length(p);
	}
}

	gl_FragColor = vec4( color, 1.0 );

}