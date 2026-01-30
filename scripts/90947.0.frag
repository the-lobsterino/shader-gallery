#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 p, float radius) {
	return length(p) - radius;
}

float line(vec2 p, float offset) {
	return abs(p.y - offset);	
}

vec2 opRotate(vec2 p, float angle) {
	float c = cos(angle);
	float s = sin(angle);
	return vec2(
		c * (p.x) - s * (p.y),
		c * (p.y) + s * (p.x)
	);
}

vec2 opTranslate(vec2 p, vec2 offset) {
	return p + offset;	
}

vec2 opRepeat(vec2 p, float repeat) {
	return mod(p, repeat);	
}

float sdf(vec2 p){
	p = opRepeat(p, 200.);
	p = opTranslate(p, vec2(-100.));
	float line_dist = line(opRotate(p, 3.14/2.), 30.);
	
	float circle_dist = circle(opTranslate(p, sin(time) * vec2(10, 10)), 50.);	
	
	return min(line_dist, circle_dist);
}


void main( void ) {

	vec2 position = gl_FragCoord.xy - resolution / 2.;
	
	float dist = sdf(position);

	gl_FragColor = vec4( vec3( position / resolution, 1.0 ), 1.0 );
	
	
	
	if (abs(dist) < 1.) {
		gl_FragColor = vec4(1.0, 0, 0, 1);
	}

}