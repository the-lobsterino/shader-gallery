#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83

float rand(vec2 n)
{ 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p)
{
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u * u * (3.0 - 2.0 * u);
	
	float res = mix(
		mix(rand(ip), rand(ip + vec2(1., 0.)), u.x),
		mix(rand(ip + vec2(0., 1.)), rand(ip + vec2(1., 1.)), u.x), u.y);
	
	return res * res;
}

vec3 hsv2rgb(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(void)
{
		vec2 position = gl_FragCoord.xy / resolution.xy;
		float nz1 = mix(noise(time * 1. + position * 100.), noise(time * 1.5 + position * 200.), 0.8);
		float nz2 = mix(noise(time * .6 + position * 300.), noise(time * 1.5 + position * 200.), 0.6);

		float plasma = (
			sin(time * .1 + 3. * length(position - vec2(.3, .3))) +
			sin(time * .2 + 3. * length(position - vec2(.7 + sin(time) * .3, .4 + cos(time) * .1))) +
			sin(time * .3 + 4. * length(position - vec2(.9, .2))) +
			sin(time * .4 + 2. * length(position - vec2(.3, .1 + cos(time) * .1))) +
			sin(time * .5 + 1. * length(position - vec2(.9 + cos(time) * .1, .6)))
		) / 5. * .5 + .5;

		float dist = pow(1. - mix(nz1, nz2, .8), 80.);

		gl_FragColor = vec4(hsv2rgb(vec3(plasma, .9, .2)) * .5 +
			hsv2rgb(vec3(.6 + dist * .4 + position.x * .1 + position.y * .1, 1. - dist, dist)) +
			hsv2rgb(vec3(time * .2, .5, .9)) * .8 * pow(1. - position.y, 15.), 1.0);
}