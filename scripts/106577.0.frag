#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float line(float c) {
	return smoothstep(0., .01, distance(c, 0.5));
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	
	color += line(p.y + sin(time + p.x * 2. *  distance(cos(p.x) * sin(p.x + time), 1.) * -20.) * .1);

	gl_FragColor = vec4(vec3(color), 1.0 );

}