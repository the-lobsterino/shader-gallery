#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

#define PI 3.14159265359

float SCALE=2.;

#define CORNER 2.

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 1.0 / 2.0, 2.0 / 5.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 2.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {

	vec2 position = surfacePosition * SCALE;
	vec2 realPos = ( gl_FragCoord.xy / resolution.xy) - 0.5;
	
	vec3 light = vec3((realPos), 0.9);

	vec3 normal = normalize(vec3(tan(position.x * PI), tan(position.y * PI), CORNER));
	
	float bright = dot(normal, normalize(light));
	bright = pow(abs(bright), 1.0);
	
	
	
	SCALE-=abs(40.*(mod(time/10.,.5)));
	vec3 color = hsv2rgb(vec3((floor(position.x + .5) +0.
				  )/SCALE, 1., 0.8)) * bright;

	gl_FragColor = vec4(color, 1.);

}