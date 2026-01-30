
// Sierpinski Carpet lil zoom
//Rolf Fleckenstein

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
	return sin(time * speed) * 0.5 + 0.5;
	
}

float t(float speed)
{
	return time / speed / 9000.;
}

float sierpinskiCarpet(vec2 p) {
	float s = 1.0;
	float f  = 1.0 / 3.0;
	float d = sdBox(p, vec2(s));
	for (int i = 0; i <16; i++) {
		
		d = max(d, -sdBox(p, vec2(f)) / s);
		p = abs(p);
		p -= f;
		p = abs(p);
		p -= f;
		p *= 3.0;
		s *= 3.0;
		if ( float(i)/6. > ((0.1/pow(tw(0.2),0.118))+0.019999)*(25./3.) ) break;
	}
	return d;	
}

void main( void ) {

	
	vec2 p = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y) * 0.3*tw(0.2);;
	vec2 m = mouse; m = vec2(0.30003, 0.3000);
	p.x += m.x*1.; p.y += m.y*1.;
	float d= sierpinskiCarpet(p * 1.3);
	
	vec3 c = d > 0.0 ? vec3(0.0) : vec3(1.0);
	
	gl_FragColor = vec4(c, 1.0);

}