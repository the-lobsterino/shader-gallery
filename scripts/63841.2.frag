#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// Made by Scrooge McDuck (tr: Varyemez Amca)
// Watch Duktales btw

uniform float time;
uniform vec2 resolution;

const float pi = radians(180.0);

float hash21(in vec2 st)
{
	return fract(sin(dot(st, vec2(235.214, 123.124)))*23526.235);
}

void main()
{
	vec2 p = (gl_FragCoord.xy - 0.5*resolution.xy) / resolution.y;
	vec2 grid_id = floor(p * 100.);
	p.x = dot(p,p);
	
	// Polar coordinates
	float angle = atan(p.y + hash21(p * 200. + time) * 0.025, p.x);
	float radius = length(p) + sin(2.0 * cos(angle*5.0 + time))*0.1;
	
	float dif = abs(cos(angle*floor(hash21(grid_id)) + time))*0.02 / abs(radius*3.6 - 1.1);
	vec3 color = vec3(dif);
	gl_FragColor = vec4(color * vec3(2,1,1), 1.0);
}