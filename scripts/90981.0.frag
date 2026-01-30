#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float Hash21(vec2 p) {
	p = fract(p * vec2(34.223, 695.95));
	p += dot(p, p + 464.21);
	return fract(p.x * p.y);
}

vec4 Truchet(vec2 pos, vec3 color) {
	vec2 tile_id = floor(pos);
	float random = Hash21(tile_id);
	
	pos = fract(pos) - 0.5;
	
	float dist = 0.0;
	
	// Randomly flip direction
	if (random < 0.5) pos.x *= -1.0;
	
	float corner_select = pos.x > -pos.y ? 1.0 : -1.0;
	vec2 circle_center = pos - vec2(0.5) * corner_select;
	float center_dist = length(circle_center);
	
	float edge_blur = 0.01;
	color *= smoothstep(edge_blur, -edge_blur, abs(center_dist - 0.5) - 0.03);
	
	float angle = atan(circle_center.x, circle_center.y);
	
	// if (pos.x > 0.49 || pos.y > 0.49) color += 1.0;
	
	color *= cos(angle * 2.0) * 0.5 + 0.5;
	return vec4(color, dist);
}

void main(void) {
	vec2 uv = gl_FragCoord.xy / resolution.y;
             uv = surfacePosition*3.;
	     uv -= time * vec2(2.0,1.0)/2.;
	vec3 color = vec3(0);
	
	uv *= 3.0;
	
	vec4 truchet1 = Truchet(uv, vec3(1.0, 0.0, 0.0));
	vec4 truchet2 = Truchet(uv + 0.5, vec3(0.0, 1.0, 0.0));
	
	color = truchet1.rgb;
	color += truchet2.rgb;
	gl_FragColor = vec4(color, 1.0);
}