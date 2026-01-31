#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 center = vec2(1.0, 0.0);

struct ring {
	float inner_radius;
	float outer_radius;
};
	
void main( void ) {

	vec2 pos = (2.0 * gl_FragCoord.xy - resolution) / max(resolution.x, resolution.y) ;//+ mouse / 16.0;

	vec4 color = vec4(0.0);
	{
		if (pos.y >= 0.0) {
			float a = 1.0 - smoothstep(0.0, 0.1, pos.y);
			color += vec4(1.0, 1.0, 1.0, a);
		} else {
			float a = 1.0 - smoothstep(0.0, -0.1, pos.y);
			color += vec4(1.0, 1.0, 1.0, a);
		}
	}
	{
		float dist = distance(pos, center);
		float delta = 4.0*fwidth(dist);
		float radius = 0.5;
		float a = 1.0 - smoothstep(radius - delta, radius + delta, dist);
		color += vec4(1.0, 1.0, 1.0, a);
	}
	{
		float curve = abs(pos.y)*4.0;
		float delta = 4.0*fwidth(curve);
		if (pos.x > (curve - 2.0*delta)) {
			float a = 1.0 - smoothstep(curve - delta, curve - 2.0*delta, pos.x);
			color += vec4(1.0, 1.0, 1.0, a);
		}
	}

		

	gl_FragColor = color;

}