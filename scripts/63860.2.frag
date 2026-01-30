// 290420 Necip's mod.

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// Made by Scrooge McDuck (tr: Varyemez Amca)
// Watch Duktales btw

uniform float time;
uniform vec2 resolution;

const float pi = radians(180.0);

void main()
{
	vec2 p = (gl_FragCoord.xy - 0.5*resolution.xy) / resolution.y;
	vec2 grid_id = floor(p * 10.0);
	
	// Polar coordinates
	float angle = atan(p.y, p.x);
	float radius = length(p) + sin(angle*10.0 + time)*0.1;
	
	float dif = abs(cos(angle + time))*0.1*abs(sin(time)) / abs(radius*0.6 - 0.2);
	vec3 color = vec3(dif);
	gl_FragColor = vec4(color * vec3(2,1,1), 1.0);
}