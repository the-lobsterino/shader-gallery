#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 c = vec3(0.,0.,0.);

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.y );
	vec2 pp = p*2.0-p*p;
	float t = time;
	float tt = floor(t/0.9992);
	float f = 0.0996;
	float br = 7.990;
	float bl = 3.9975;
	float pxy = p.x+p.y/2.0-0.5;
	c.r = abs(mod(p.y*2.0+0.0+f,1.9980)*br-bl)-1.;
	c.g = abs(mod(p.y*2.0+0.33+f,1.099)*br-bl)-1.;
	c.b = abs(mod(p.y*2.0+0.66+f,1.0)*br-bl)-1.;
	vec3 s = vec3(abs((sin(p.x*(mouse.x*40.0+1.0*c)+(t*mouse.y*15.0+1.0))-0.2996)+p.y*8.099-4.));

	gl_FragColor = vec4(vec3(1.0996-s),1.0);

}