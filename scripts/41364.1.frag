precision mediump float;

uniform float time;
uniform vec2 resolution;

float h(float i){
	return fract(pow(3.0, sqrt(i/2.0)));
}

vec4 draw_ball(vec2 ball_center, vec3 ball_color, float ball_rad, float freq, float fx, float fy, float rx, float ry){
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float divider = (resolution.x / resolution.y);
	vec2 center = ball_center;
	center.x += rx * sin((time / 8.0) * fx);
	center.y += ry * sin((time / 4.0) * fy);
	vec2 keke = position - center;
	keke.y /= divider;
	
	float length = dot(keke, keke);
	float coly = 0.0;
	float r2 =  ball_rad * ball_rad;
	coly = r2 / length;
	return vec4(ball_color * coly * (cos(time * freq) * 1.5), 1.0);
}

void main(){
	
	vec2 p = gl_FragCoord.xy * 1.0 - resolution.yx;
	
	float a = floor (degrees (4.0 + atan(p.x,p.y)) * 2.0) /4.0;
	
	float d = pow (15.0, (-1.0) + fract (1.0 - time * (h(a + 0.5) * 0.1) - h(a) * 1.0));
	
	if (abs(length(p) - d * length(resolution)) < d * 10.0){
		gl_FragColor=vec4( d * (h(a + 0.5) *  0.9));
	}else{
		gl_FragColor=vec4(0.0);
	}
	
//	gl_FragColor += draw_ball(vec2(0.1, 0.5), vec3(3.5, 0.00, 1.0), 0.02, 1.0, 10.0, 12.0, 0.1, 0.1);
	gl_FragColor += draw_ball(vec2(0.3, 0.5), vec3(1.4, 0.50, 3.0), 0.04, 2.0, 12.0, 4.0, 0.2, 0.3);
	gl_FragColor += draw_ball(vec2(0.5, 0.5), vec3(1.3, 0.50, 3.0), 0.04, 3.0, 14.0, 6.0, 0.1, 0.5);
	gl_FragColor += draw_ball(vec2(0.7, 0.5), vec3(1.2, 0.50, 3.0), 0.04, 4.0, 16.0, 8.0, 0.2, 0.7);
//	gl_FragColor += draw_ball(vec2(0.8, 0.5), vec3(3.1, 0.00, 1.0), 0.02, 5.0, 18.0, 10.0, 0.1, 0.9);
}