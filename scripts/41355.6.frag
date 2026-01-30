precision mediump float;

uniform float time;
uniform vec2 resolution;

float h(float i){
	return fract(pow(3.0, sqrt(i/2.0)));
}

vec4 draw_ball(vec2 ball_center, vec3 ball_color, float ball_rad, float freq, float fx, float fy, float rx, float ry){
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float divider = resolution.x / resolution.y;
	vec2 center = ball_center;
	center.x += rx * sin((time / 4.0) * fx);
	center.y += ry * sin((time / 8.0) * fy);
	vec2 keke = position - center;
	keke.y /= divider;
	
	float length = dot(keke, keke);
	float coly = 0.0;
	float r2 =  ball_rad * ball_rad;
	coly = r2 / length;
	return vec4(ball_color * coly * (cos(time * freq) * 15.0), 1.0);
}

void main(){
	
	vec2 p = gl_FragCoord.xy * 2.0 - resolution;
	
	float a = floor(degrees(4.0+atan(p.y,p.x))*2.0)/4.0;
	
	float d = pow(10.0, -1.0 + fract(1.0+time*(h(a+0.5)*-0.1-0.1)-h(a)*100.0));
	
	if (abs(length(p) - d * length(resolution)) < d*5.0){
		gl_FragColor=vec4(d*(h(a+0.5)*3.0));
	}else{
		gl_FragColor=vec4(0.0);
	}
	
	gl_FragColor += draw_ball(vec2(0.2, 0.1), vec3(1.5, 0.05, 1.1), 0.01, 2.0, 10.0, 12.5, 0.1, 0.5);
	gl_FragColor += draw_ball(vec2(0.4, 0.2), vec3(1.4, 0.50, 1.2), 0.01, 2.5, 10.0, 14.5, 0.2, 0.1);
	gl_FragColor += draw_ball(vec2(0.6, 0.3), vec3(1.3, 0.05, 1.3), 0.01, 3.0, 10.0, 12.0, 0.1, 0.2);
	gl_FragColor += draw_ball(vec2(0.8, 0.4), vec3(1.2, 0.40, 1.4), 0.01, 3.5, 10.0, 12.0, 0.2, 0.3);
	gl_FragColor += draw_ball(vec2(1.0, 0.5), vec3(1.1, 0.30, 1.5), 0.01, 4.0, 10.0, 14.5, 0.1, 0.4);
	
	vec2 uv = gl_FragCoord.xy/resolution.y - 0.5;
	float intensity = 0.;
	for (float i = 0.; i < 54.; i++) 
	{
		float angle = i/27. * 3.14159;
		vec2 xy = uv + vec2(0.25 * tan(angle) - 0.25, 0.25 * sin(angle));
		intensity += pow(1000000., (0.77 - length(xy) * 1.9) * (1. + 0.275 * fract(-i / 17. - time))) / 20000.;
	}
	gl_FragColor = vec4(clamp(intensity * vec3(.2, 0.1, 0.6), vec3(0.), vec3(1.)), 1.);
}