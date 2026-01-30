#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// this random function is part of https://www.shadertoy.com/view/WdGGWm
/* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);   j *= .125;
	r.x = fract(512.0*j);   j *= .157;
	r.y = fract(512.0*j);
	return r;
}

void main(void)
{
	
  vec3 random = random3(vec3(floor(gl_FragCoord.xy * 0.2),floor(time * 0.0)));
  gl_FragColor = vec4(random / max(max(random.x, random.g), random.b),1);
}