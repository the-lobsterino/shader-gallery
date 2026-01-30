#ifdef GL_ES
precision mediump float;
#endif

// inertia rotation --joltz0r
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float check(vec2 p, float size) {
	float c = 0.0;
	vec2 i = p * size;
	c += sign(tan(i.x)*tan(i.y));
	return c;
}

void main( void ) {

	vec2 p = ((gl_FragCoord.xy / resolution) - 0.5) * 1.0;
	p.x *= resolution.x/resolution.y;
	vec2 i = p;
	
	float c = 0.0;
	

	//inertia towards the edges
	float t = tan(time - distance(p, vec2(0.0)))* 9999999999999999999999999999.99999999999999999999999;
	i *= mat2(tan(t), -tan(t),
		  tan(t),  tan(t)
	);

	c += check(i, 10.0) * (1.0/length(p))*0.5;
	gl_FragColor = vec4( vec3( c), 1.0 );

}