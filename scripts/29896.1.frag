#ifdef GL_ES
precision mediump float;
#endif

// original http://glslsandbox.com/e#29893.0

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926535

void main( void ) {

	vec2 pos = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y + mouse - 0.5;
	float angle = atan(pos.y, pos.x);
	angle += cos(time * 3.0) * 0.1;
	angle = mod(angle, PI / 3.0) - PI / 6.0;
	
	float len = length(pos);
	
	pos = vec2(cos(angle), sin(angle)) * len;
	//pos = mod(pos, 0.2) - 0.1;
	float color = 0.0;
	color += pos.x - pos.y;
	
	color += 0.01 / length(pos + vec2(-0.5 + 0.3 * sin(time * 3.0), 0.0));
	
	pos.x = mod(pos.x, 0.1) - 0.05;
	
	if (pos.x > sin(time * 0.5) * 0.05)
	{
		color -= 0.2;
	}
	
	gl_FragColor = vec4(color, color, color, 1.0);

}