#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float dist(vec3 p) {	
	return length(vec3(0,0,4) - p) - .7;
}

void main( void ) {

	vec2 position = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
	
	int a = 0;
	vec3 dir = normalize(vec3(position.x, position.y, 1.0));
	vec3 p = vec3(0);
	for (int i = 0; i < 50; i++) {
		float d = dist(p);
		if (d < 0.001) break;
		p += dir*d;
	}
	

	gl_FragColor = vec4(10.0/length(p));

}
