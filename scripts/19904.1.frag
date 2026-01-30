#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define time tan(time)

vec2 toPolar(vec2 p) {
	float a = atan(p.y/p.x);
	if (p.x < 0.0) a += 3.1415;
	float r = sqrt(p.x*p.x + p.y*p.y);
	return vec2(a, r);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy )*2.0 - 1.0 + mouse / 4.0;
	p.x = p.x*(resolution.x/resolution.y);
	p *= 1.5;
	float a = 0.0;
	
	p /= dot(p, p);
	
	vec2 polar = toPolar(abs(p));

	float t = time * .03;
	float c = cos(t);
	float s = sin(t);
	
	mat2 rm = mat2(c, s, -s, c) * 1.3;
	for(int i = 0; i < 7; i++)
	{
		polar = abs(polar)-1.5;
		polar *= rm;

		a += .011/abs(polar.y - polar.x/5.);
		a += .001/abs(polar.y - polar.x/5.);
		a += .001/abs(polar.y - polar.x/5.);
		a += .001/abs(polar.y - polar.x/5.); //sphinx
	}
	
	gl_FragColor = vec4( vec3(a), 1.0 );
}