#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse; 
uniform vec2 resolution;

float rand1(float x) {
	return fract(sin(x) * 43578.23);
}

float rand2(vec2 p) {
	return fract(sin(p.x * 15.32 + p.y * 35.68) * 43578.23);	
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = p * 2.0 - 1.0;
	p.x *= resolution.x / resolution.y;

	p.x += sin(p.y * 10.0 + time) * 0.1;
	float col = rand2(floor(p * 5.0));
	float d = distance(p, vec2(0.0));
	col = col * (1.0 - d);
	col = 1.0;
	gl_FragColor = vec4( vec3( col ), 1.0 );

}