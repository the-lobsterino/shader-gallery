#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 resoHalf = resolution * .5;

void main()
{
	vec2 p = gl_FragCoord.xy;

	vec2 mouseabs = (mouse * resolution) - resoHalf;
	
	float mouseDist = distance(resoHalf + mouseabs, resoHalf);
	float fragDist =  mouseDist / distance(p, resoHalf);
	
	float r = sin(p.x) * fragDist;
	float g = cos(p.y) * fragDist;
	
	float b = (r*g);
	
	gl_FragColor = vec4(b*sin(time), b*cos(time), b*atan(time), 1);
}