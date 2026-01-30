#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;

vec4 draw_ball(vec2 ball_center, vec3 ball_color, float ball_rad){
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 center = ball_center;
	vec2 curpos = position - center;
	
	float length_ = dot(curpos, curpos);
	float coly = 0.0;
	float r2 = ball_rad * ball_rad;
	coly = r2 / length_;
	return vec4(ball_color * coly, 1.0);
}

void main(void)
{
	gl_FragColor += draw_ball(vec2(0.5, 0.5), vec3(1.0, 1.0, 1.0), 0.02);
}