#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 color = vec3(0.0, 0.0, 0.0);

void main( void ) 
{
	vec2 pos = (2.0 * gl_FragCoord.xy - resolution.xy) / resolution.y;
	//vec2 p = vec2(.5, .5);
	
	//p.x *= 1.0 / cos(time*0.3);
	//p.y *= 1.0 / cos(time*0.3);
	
	//normalize(p.x);
	
	//float dist = distance( p, pos );
	
	
	float constant = 3.0 / ((cos(time*0.3)+2.)* 20. * abs(2. * pos.x - pos.y + 3.0 * cos(time*0.3))) + 3.0 * cos(time*0.3);
	
	color.r = 0.5 * constant;
	color.g = 0.5 * constant;
	color.b = 0.35 * constant;
	
	//color.r = 0.15 / dist;
	//color.g = 0.15 / dist;
	//color.b = 0.1 / dist;
	
	gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
}