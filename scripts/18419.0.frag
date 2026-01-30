#ifdef GL_ES
precision highp float;
#endif

#define PI 3.1415926535897932384626433832795

uniform vec2 resolution;
uniform float time;

varying vec2 surfacePosition;

void main()
{

	vec2 pos = (gl_FragCoord.xy / resolution) * 2. - 1.;

	float amp = 0.5;		// amplitud
	float offset = time * .1 * PI;	// periodo en segundos

	float r = 0.05 / abs(sin(PI * pos.x + offset * .6) + pos.y / amp);
	
	float g = 0.05 / abs(sin(PI * pos.x + offset * .3) + pos.y / amp);
	
	float b = 0.05 / abs(sin(PI * pos.x + offset * .9) + pos.y / amp);
	
	vec3 color = vec3(r, g, b);
	
	gl_FragColor = vec4(color, 1);
}
