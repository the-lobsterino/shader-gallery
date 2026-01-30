#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(vec2 p) {
	return fract(4e3 * sin(dot(p, vec2(342.35, 7654.316))));
}
 
float n(vec2 p) 
{
	vec2 id;
	
	id = floor(floor(p)-.5);
	
	p *= floor(hash(id) * 2.)+1.;
	id = floor(p);
	
	p.yx *= floor(hash(id) * 3.)-4.;
	id -= floor(p);

	p *= floor(hash(id) * 2.)+1.;
	id = floor(p);

	p -= id;

	vec2 u = abs(p - .5) * 2.;

	return max(u.x, u.y);
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	vec3 col = vec3(0);
	
	col += n(p * 10.);
		
	
	gl_FragColor = vec4(col, 1);

}