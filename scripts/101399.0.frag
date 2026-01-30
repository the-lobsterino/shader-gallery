#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 c = vec3(0.);

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.y );
	p /= dot( p, p );
	vec2 pp = p*2.09-p*p;
	float t = time;
	float f = 0.09;
	float br = 7.0999;
	float bl = 3.599;
	float pxy = p.x+p.y/2.0-0.5;
	//c.r = abs(mod(p.y*2.0+0.0+f,1.0)*br-bl)-1.;
	//c.g = abs(mod(p.y*2.0+0.33+f,1.0)*br-bl)-1.;
	//c.b = abs(mod(p.y*2.0+0.66+f,1.0)*br-bl)-1.;
	c = vec3(abs((sin(p.x*(mouse.x*40.0+1.0)+(t*mouse.y*10.0+1.0))-0.2)+p.y*8.0-4.));

	gl_FragColor = vec4(vec3(1.0-c),1.0);

}