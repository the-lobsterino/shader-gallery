/** PSYCHEDELIA **/
// by byteManiak
// contact info: bytemaniak 98 at gmail dot com

#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float f(float x)
{ return exp(mod(sin(.0005), pow(x, 3.))); }

bool cmp(float a, float b, float epsilon)
{ return (abs(a-b))<epsilon; }

void main() {
	vec2 p = gl_FragCoord.xy / resolution.xy - .5;
	
	if(cmp(1., f(p.x*p.y), .00003))
		gl_FragColor += vec4(1.);
	
	gl_FragColor *= vec4(cos(time), sin(time), 1.-sin(time), 1.0) * tan(resolution.x/p.x / resolution.y*p.y);
}