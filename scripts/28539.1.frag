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
	c += sign(sin(i.x)*cos(i.y));
	return c;
}

void main( void ) {

	vec2 p = ((gl_FragCoord.xy / resolution) - 0.5) * 2.0;
	p.x *= resolution.x/resolution.y;
	vec2 i = p;
	
	float c = 0.0;
	

	//inertia towards the edges
	float t = sin(time - distance(p, vec2(0.0)))*2.0;
	i *= mat2(cos(t), -sin(t),
		  sin(t),  cos(t)
	);

	c += check(i, 10.0) * (1.0/length(p))*0.5;
	gl_FragColor = vec4( vec3( c), 1.0 );

}