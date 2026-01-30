#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float a = resolution.x / resolution.y;

vec4 spiral(vec2 center, float rotation)
{
	vec2 coord = vec2(gl_FragCoord.x * a, gl_FragCoord.y);
	
	vec2 origin = vec2(center.x * a, center.y);	
	vec2 cart = origin - coord / resolution.xy;
	vec2 polar = vec2(atan(cart.y, cart.x), length(cart));
	
	float md = polar.y + 0.1 * sin(9.0 * polar.x + 0.5 * rotation) + 0.01 * sin(18.0 * polar.x + 2.8 * rotation);
	float mask = smoothstep(md, md + 0.05, 0.4);
	
	float la = 5.0 * polar.x + 45.0 * polar.y;
	
	vec4 color = vec4(0.0);
		
	color.r = 2.5 * polar.y * (1.0 + sin(la - rotation));
	color.g = 0.6 * smoothstep(0.2, 0.4, polar.y) * color.r;
	color.b = 0.1 * polar.y;
	
	color.rgb += 0.25 * (sin(coord.x) * sin(coord.y)) * color.b;
	return color * mask;
}

void main()
{
	gl_FragColor += spiral(vec2(0.32, 0.5), 1.5 * time);
	gl_FragColor += spiral(vec2(0.68, 0.5), -2.0 * time);
	gl_FragColor += spiral(vec2(0.50, 1.15), 2.0 * time);
	gl_FragColor += spiral(vec2(0.50, -0.15), -time);
	gl_FragColor += spiral(vec2(0.85, -0.15), time);
	gl_FragColor += spiral(vec2(0.15, -0.15), 1.5 * time);
	gl_FragColor += spiral(vec2(0.15, 1.15), -time);
	gl_FragColor += spiral(vec2(0.85, 1.15), time);
	gl_FragColor += spiral(vec2(1.05, 0.5), 1.5 * time);
	gl_FragColor += spiral(vec2(-.05, 0.5), time);
}