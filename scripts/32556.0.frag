#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float colr(vec2 p)
{
	p *= 20.;
	
	vec2 q = mod(p, vec2(1.0,1.0)) - vec2(0.5,0.5);
	if(mod(p.y,2.0) > 1.0) q = -q;
	float f1 = step(2. * q.y + 4. * q.x - 1.0, 0.);
	float f2 = step(2. * q.y - 4. * q.x - 1.0, 0.);
	q.y *= 2.0 * f1 * f2 - 1.0;
	q.y += 0.15;
	q.x = f1 * f2 * q.x + (1.0 - f1)*(0.5 - q.x) + (1.0 - f2)*(-0.5 - q.x);
	return step(length(q), 0.08) 
		+ step(abs(q.x),0.02)*step(q.y,0.0)
		+ step(abs(q.x+1.65*q.y),0.03)*step(q.x,0.0)
		+ step(abs(q.x-1.65*q.y),0.03)*(1.0-step(q.x,0.0))		;
}


void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution.x) - vec2(0.5, 0.5 * (resolution.y / resolution.x));
	float c = colr(p); 
	gl_FragColor = vec4(c,c,c, 1.0);
}