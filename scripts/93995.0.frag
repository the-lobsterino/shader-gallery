#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float grid (vec2 p){
	p = fract(p);
	if (p.x > 0.9 || p.y > 0.9 ) return 1.;
	return 0.;
}

void main( void ) {
	vec2 p = ( gl_FragCoord.xy *2. - resolution )/ min(resolution.x, resolution.y);
	float a = 2.* p.y;
	p.x += sin(5.*a);
	
	p *= 10.;
		
	gl_FragColor = vec4( vec3(grid(p)) , 1.0 );
}