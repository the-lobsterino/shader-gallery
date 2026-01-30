#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define PI 3.141513375359
#define T (time / .99)

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 12.4, 789.8);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - 0.5);
	position.x *= resolution.x / resolution.y;
	
	vec3 color = vec3(0.);
	
	for (float i = 0.; i < PI*2.0; i += PI/20.0) {
		vec2 p = position - vec2(cos(i), sin(i)) * 0.15;
		vec3 col = hsv2rgb(vec3((i + T)/(PI*2.0), 1., 1));
		color += col * (2./512.) / length(p);
	}

	gl_FragColor = vec4( color, 1.0 );

}