// pure ass
#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co)
{
	return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
}

float pattern (vec2 pos, float t)
{
	return step(rand(pos.yy + vec2(t / 3.)), pos.x);
}

void main( void ) {
	vec2 p = gl_FragCoord.xy / min(resolution.x, resolution.y);
	p-=0.5;
	p.x = dot(p,p)*2.0;
	float t = time * 2. + p.x / 2.;
	float v = mix(pattern(p, floor(t)), pattern(p, ceil(t)), fract(t));
	gl_FragColor = vec4(mix(vec3(.1, 0.53, .36), vec3(.54, .1, 1.), p.x) * (1.25 - .5 * v), 1.0 );

}