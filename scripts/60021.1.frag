// Looks oddly like a 3d shape but it isn't really
// randomly modified
//++
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec2 cmul(const vec2 c1, const vec2 c2)
{
	return vec2(
		c1.x * c2.x - c1.y * c2.y,
		c1.x * c2.y + c1.y * c2.x
	);
}

void main( void ) {
	vec2 p = surfacePosition*4.0 + vec2(0.0,.0);
	vec2 z = vec2(0.9, -(sin(time*.25))*0.9);
	float d = 1.0;
	for (int i = 0; i < 10; i++) {
		z =  z.xy * vec2(1.1, -1.2);
		p -= (sin(time*.32))*cmul(z,z)*1.3;
		z = (cos(time*.2))*cmul(z, p);
		d = min(d, distance(p, z))-0.001;
	}
	gl_FragColor = vec4(z.y*p.x,z.x*p.y, d, 1.0);
}