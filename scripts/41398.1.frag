// want to make circles rotate around the mouse pointer.
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
#define pi 3.14159265
#define COUNT 5
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec4 draw_ball(vec2 center, vec3 ball_color, float ball_rad){
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float divider = resolution.x / resolution.y;
	vec2 curpos = position - center;
	curpos.y /= divider;
	float length_ = dot(curpos, curpos);
	float coly = 0.0;
	float r2 = ball_rad * ball_rad;
	coly = r2 / length_;
	return vec4(ball_color * coly, 1.0);
}

vec4 circular(vec3 balls_color, float balls_rad, float balls_speed, float rot_rad){
	// Suppose, there should be better way to do it. :)
	vec2 rot_center = mouse;
	float angle_step = 2.0 * pi / float(COUNT);
	float divider = resolution.x / resolution.y;
	vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
	for(int i = 0; i < COUNT; i++){ // non-const variable can't be used in compare with loops index. D:
		float curangle = angle_step * float(i);
		vec2 center = vec2(rot_center.x + rot_rad * cos((time * balls_speed + curangle)) / divider, rot_center.y + rot_rad * sin(time * balls_speed + curangle));
		color += draw_ball(center, balls_color, balls_rad);
	}
	return color;
}

void main( void ) {
	gl_FragColor += circular(vec3(1.0, 0.05, 0.05), 0.007, 3.5, 0.05);
}