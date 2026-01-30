#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 draw_ball(vec2 ball_center, vec3 ball_color, float ball_rad, float freq, float fx, float fy, float rx, float ry){
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float divider = resolution.x / resolution.y;
	vec2 center = ball_center;
	center.x += rx * cos(time * fx);
	center.y += ry * sin(time * fy);
	vec2 curpos = position - center;
	curpos.y /= divider;
	
	float length_ = dot(curpos, curpos);
	float coly = 0.0;
	float r2 = ball_rad * ball_rad;
	coly = r2 / length_;
	return vec4(ball_color * coly * (sin(time * freq) + 2.0), 1.0);
}

void main( void ) {
	// 2d coordinates.
	gl_FragColor += draw_ball(vec2(0.5, 0.5), vec3(0.5, 0.05, 0.05), 0.05, 3.0, 3.0, 2.5, 0.1, 0.25);
	gl_FragColor += draw_ball(vec2(0.7, 0.5), vec3(0.05, 0.5, 0.05), 0.04, 4.0, 1.0, 4.5, 0.2, 0.1);
	gl_FragColor += draw_ball(vec2(0.3, 0.5), vec3(0.05, 0.05, 0.7), 0.04, 2.5, 5.0, 2.0, 0.1, 0.3);
	gl_FragColor += draw_ball(vec2(0.6, 0.5), vec3(0.05, 0.4, 0.05), 0.05, 3.5, 3.0, 2.0, 0.2, 0.3);
	gl_FragColor += draw_ball(vec2(0.25, 0.5), vec3(0.3, 0.3, 0.05), 0.04, 2.5, 1.0, 4.5, 0.2, 0.4);
}