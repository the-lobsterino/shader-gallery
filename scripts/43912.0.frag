#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 HSV2RGB(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	p = floor(p*256.0)/256.0;
	
	float koef =   log2(0.2-p.x*p.y) *2.-1.*cos(time)+sin(-time)* 0.2;
	float vstep = koef * 20.0;
	float vfloor = floor(vstep);
	 
	 
	float color = vfloor * .1;//, -1.0, 1.0));
	
	gl_FragColor = vec4(HSV2RGB(vec3(color, 1.0, 1.0)*0.95) , 1.0 );

}