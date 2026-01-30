#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	vec2 p = (2.0 * gl_FragCoord.xy - resolution.xy) / resolution.y;
	//vec2 p = gl_FragCoord.xy / resolution.xy;
	//p = 2.0 * p - 1.0;
    	float r = length(p) * 1.0;
	r = 2.0 * r - 1.0;
	float alpha = 1.0 / (((sin(time) + 2.5) * 30.) * abs(r));
	vec3 color = vec3(sin(time),cos(time),tan(time));
	gl_FragColor = vec4(alpha * color, alpha);
}