// Author @patriciogv - 2015 - patricio.io

#ifdef GL_ES
precision mediump float;
#endif

const float PI = 3.1415926535897932384626433832795;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;


void main()
{
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	vec3 color = vec3(0);
	color.r =  0.01 / abs(length(p) - sin(0.8 * time) * 0.5 - 0.01);
	color.g = sin(2.8 * time) * 0.2 + 0.25 / length(p);
	color.b =  0.01 / abs(length(p) - sin(2.8 * time) * 0.5 - 0.01);
	
 	gl_FragColor = vec4(color,1.0);
}
