#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) + -mouse;
	vec2 pp = p*2.0-p*p;
	float t = time;
	float f = 0.0;
	float br = 7.0;
	float bl = 3.5;
	float pxy = p.x*p.y/2.0;
	vec3 c = vec3(0.,0.,0.);
	c.r = abs(mod(p.y*2.0+0.0+f,1.0)*br-bl)-1.;
	c.g = abs(mod(p.y*2.0+0.33+f,1.0)*br-bl)-1.;
	c.b = abs(mod(p.y*2.0+0.66+f,1.0)*br-bl)-1.;
	c = vec3(sin(length(p)*20.0));

	gl_FragColor = vec4(vec3(c),1.0);

}