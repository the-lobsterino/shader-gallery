#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 draw_ball(vec2 ball_center, float ball_rad, vec3 ball_color, float motion_rad, float rotation_vel, vec2 rot_center){
	// rotation velocity in degrees / seconds
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float divider = resolution.x / resolution.y;
	vec2 center = ball_center;
	//center.x += sin(time) * 0.25;
	vec2 rot_position = position - rot_center;
	rot_position.y /= divider;
	float rot_dist = sqrt(rot_position.x * rot_position.x + rot_position.y * rot_position.y);
	center.x += rot_dist * cos(rotation_vel / 2.0 / 3.5 * time);
	center.y += rot_dist * sin(rotation_vel / 2.0 / 3.5 * time);
	vec2 curpos = position - center;
	curpos.y /= divider;
	
	float length_ = sqrt(curpos.x * curpos.x + curpos.y * curpos.y);
	float coly = 0.0;
	if (length_ < ball_rad){
		coly = (ball_rad - length_)/ball_rad;
	}	
	return vec4(ball_color * coly, 1.0);
}

void main( void ) {
	// 2d coordinates.
	gl_FragColor += draw_ball(vec2(mouse.x, mouse.y), 0.01, vec3(1.0, 0.0, 1.0), 0.15, 10.0, vec2(0.5, 0.5));
	gl_FragColor += draw_ball(vec2(mouse.x-0.012, mouse.y+(sin(time*2.0))*0.03), sin(time)*3.0*0.05, vec3(1.0, 0.0, 0.0), 0.15, 10.0, vec2(0.5, 0.5));
	gl_FragColor += draw_ball(vec2(mouse.x-0.012, mouse.y+(cos(time*2.0))*0.03), cos(time)*3.0*0.05, vec3(0.0, 0.0, 1.0), 0.15, 10.0, vec2(0.5, 0.5));
}