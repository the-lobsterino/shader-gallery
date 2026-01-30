#ifdef GL_ES
precision mediump float;
#endif

// inertia rotation --joltz0r
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float check(vec2 p, float size) {
	return mod(floor(p.x * size + sin(time * 0.5)) + floor(p.y * size + sin(time * 0.5)),1.01 + sin(time *  0.5));
}

void main( void ) {

	vec2 p = ((gl_FragCoord.xy / resolution) - 0.5) * 2.0;
	p.x *= resolution.x/resolution.y;	

	//inertia towards the edges
	float t = sin(time - distance(p, vec2(0.0)));
	p *= mat2(sin(t), -sin(t),
		  sin(t),  atan(t)
	);

	gl_FragColor = vec4(check(p, 3.0) * (1.0/length(p))*0.5);
}