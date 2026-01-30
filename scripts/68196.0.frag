#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 getNext(vec2 zi, vec2 c)
{
	vec2 next;
	next.x = zi.x * zi.x - zi.y * zi.y + c.x;
	next.y = 2.0 * zi.x * zi.y + c.y;
	return next;
}


void main( void ) {
	//vec2 position = ( gl_FragCoord.xy / resolution.xy) / 1.0;
	vec2 position = (gl_FragCoord.xy / resolution.xy - vec2(0.5, 0.5)) / 0.3;
	vec2 z;
	for(int i = 0;i < 100;i++)
	{
		z = length(z) > 100.0 ? z : getNext(z, position);
	}
	float len = length(z);
	float color = len > 100.0 ? len / 1000.0 : 0.0;
	gl_FragColor = vec4(color, color, color, 1);
}