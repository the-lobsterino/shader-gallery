#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform sampler2D bb;

float
rand(vec2 co)
{
	return fract(sin(dot(co.xy, vec2(12.9898, 78.233)))*43758.5453);
}

void main(void)
{
	vec2 coord = gl_FragCoord.xy/resolution * vec2(1.0, resolution.y/resolution.x);

	vec4 color = vec4(0., 0., 0., 0.);

	for (float i = 0.; i < 50.; i++) {
		const float min_period = 10.;
		const float max_period = 30.;
		float period = min_period + rand(vec2(i, 0.))*(max_period - min_period);

		float start = period*rand(vec2(i, 1.));

		const float min_radius = .01;
		const float max_radius = .05;
		float radius = min_radius + rand(vec2(i, 2.))*(max_radius - min_radius);

		float r = time - start;
		vec2 pos = vec2(mod(r, period)/period, rand(vec2(.1*ceil(r/period), i)));

		const float min_angle_speed = -.5;
		const float max_angle_speed = .5;
		float angle_speed = min_angle_speed + rand(vec2(i, 0.3))*(max_angle_speed - min_angle_speed);

		float angle = atan(pos.y - coord.y, pos.x - coord.x) + angle_speed*time + mouse.x*(mouse.y + 1. * 2.);

		float dist = radius + .2*sin(6.*angle)*radius;

		color += (1. - smoothstep(dist, dist + .01, distance(coord, pos))) * 
			vec4(rand(vec2(i, 2.3)), rand(vec2(i, 2.5)), rand(vec2(i, 2.1)), 1.) * 0.07;
	}
	color += texture2D(bb, gl_FragCoord.xy/resolution) * .95;
	gl_FragColor = color;
}
