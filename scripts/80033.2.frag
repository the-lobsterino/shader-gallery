// Rolf Fleckenstein - ändrom3da

// epic epileptic version

#extension GL_OES_standard_derivatives : enable

#define FOG_STRENGTH   1.50
#define PATTERN        6.00
#define SPEED          0.75
#define CHECKERBOARD   1.00                        // use 1.0 for checkerboard
#define PLANE_DISTANCE 2.00

precision highp float;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

#define rotate(a) mat2(cos(a), sin(a), -sin(a), cos(a))

void main(void)
{
	float toggle = 1.0;
	toggle = sin(120.*time);
	if (toggle < 0.0) toggle = -1.0;
	else              toggle = +1.0;
	float t = time * SPEED;
	vec3 c = vec3(0.0, 0.0, 0.0);            // kinda initialize the color variable
	vec2 p = (2.0* gl_FragCoord.xy - resolution.xy) / resolution.y    -   vec2(-2.0+4.0*mouse.x, -1.0+2.*mouse.y);
	p *= rotate(t);                           // rotate the domain
	vec2 p0 = p;                              // use the "original domain" for later (for the fog in the middle)
	p.y = PLANE_DISTANCE/abs(p.y); p.x *= p.y; p.y += t; // https://www.tiktok.com/@inigoquilez/video/6985041747730550021       <---- ^_^    other guys stuff
	c += (sin(PATTERN*p.x*toggle) + sin(PATTERN*p.y*toggle)) / ((1.0 - CHECKERBOARD) * 3.14159) + 0.5;  // the pattern
	c.xz = vec2(0.25, 0.75);                           // color change
	float fog = 1.0 - pow(abs(p0.y), FOG_STRENGTH); // the fog
	gl_FragColor = vec4(c, 1.0 - fog);
} 