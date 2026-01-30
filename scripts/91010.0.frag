


// Rolf Fleckenstein - ändrom3da
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rotate(a) mat2(cos(a), sin(a), -sin(a), cos(a))

#define PATTERN         1.0
#define ZOOM_SPEED      0.5
#define ROTATION_SPEED  4.0

void main(void)
{
	vec2 p = (2.0*gl_FragCoord.xy - resolution.xy) / resolution.y;
	p -= vec2(-2.0+4.0*mouse.x, -1.0+2.*mouse.y);
	p *= rotate(ROTATION_SPEED*time);
	p *= 20.*(0.1+sin(ZOOM_SPEED*time)*0.5+0.50001);
	vec3 c = vec3(0.0, 0.0, 0.0);
	c += sign(sin(PATTERN * p.x)); 
	c *= sign(sin(PATTERN * p.y)); 
	c.xz = vec2(0.25, 0.75);

	
	gl_FragColor = vec4(c, 1.0);
}