//     A
//     |
//     |
// Go 0.5 ZOOM for this one 

// pretty cheap zoom version of Sierpinski Carpet
// Rolf Fleckenstein
//
// fun question: what is the surface area of an sierpinski carpet ? =)


#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdBox(vec2 p, vec2 s) {
	p = abs(p) - s;
	return length(max(p, 0.0)) + min(max(p.x, p.y), 0.0);
}

float tw(float speed)
{
	return clamp(sin(time * speed) * 0.5 + 0.5, 0.0091, 1.0);
	//return 0.0091;
}

float t(float speed)
{
	return time / speed / 9000.;
}

float inCircle(vec2 pt, float radius)
{
	return (smoothstep(radius, radius-0.008, length(pt))
	     - smoothstep(radius + 0.008, radius, length(pt)))*-1.;
}

float sierpinskiCarpet(vec2 p) {
	float s = 1.0;
	float f  = 1.0 / 3.0;
	float d = sdBox(p, vec2(s));
	for (int i = 0; i <25; i++) {
		
		d = max(d, -sdBox(p, vec2(f)) / s);
		p = abs(p);
		p -= f;
		p = abs(p);
		p -= f;
		p *= 3.0;
		s *= 3.0;
		if ( float(i)/6. > ((0.1/pow(tw(0.2),0.137028))+(0.079999*pow(1.-tw(0.2),3.0)))*(25./3.) ) break;
	}
	return d;	
}

void main( void ) {

	
	vec2 p = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
	vec2 p0 = p;
	p *= 0.3*(pow(tw(0.2), 2.0)+0.0000000009);
	//  (pow(tw(), 50.0) + 0.009);

	vec2 m = mouse; 
	p.x += m.x*1.; p.y += m.y*1.;
	float d= sierpinskiCarpet(p * 1.3);
	
	vec3 c = d > 0.0 ? vec3(0.0) : vec3(1.0);
	c -= inCircle(p0, 0.1) * vec3(0.0, 1.0, 1.0); 
	c += inCircle(p0, 0.1) * vec3(1.0, 0.0, 0.0); 
	
	gl_FragColor = vec4(c, 1.0);

}