#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 1000.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);
   
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float posterize(float num, float inc){
	return floor(num*inc)/inc;
}

float ease(float t, float pow_){
	float pow_t = pow(t,pow_);
	return pow_t/(pow_t+pow(1.0-t,pow_));
}

float noise_val(float x, float a, float b, float c, float d, float e, float f){
	
	vec2 noise_coord = vec2(a*x+(time/b));
	noise_coord = noise_coord + sin(time/e)*d;
	noise_coord = noise_coord + f;
	noise_coord = noise_coord * a;
	noise_coord = noise_coord + time/b;
	//noise_coord.x = posterize(noise_coord.x,4.0);
	float val = noise(noise_coord);
	
	val = pow(val+0.2, c);
	return val;
}



void main( void ) {

	vec2 st = ( gl_FragCoord.xy / resolution.xy );
	vec3 color = vec3(0.0);
	vec3 bkg = vec3(0.7);
	
	float divs = 14.0;
	float y_step = posterize(st.y, divs);
	


	float in_rect = 0.0;
	
	float rndm = random(vec2(y_step));
	
	float time_factor = -0.0000;
	float time_ = time/((rndm/40000.0)+time_factor);

	float time_step = posterize(time_, 1.0);
	// resets every second
	float sub_time = (time_)-time_step;
	
	float motion_power = 16.0;
	float eased_time = ease(sub_time,motion_power);
	
	// changing pos	
	float current_x = random(vec2(time_step+y_step));
	float next_x = random(vec2(1.0+time_step+y_step));
		
	float x_mix = mix(current_x,next_x,eased_time);
	//a = pow(a,4.0);
	//float a = current_x;
	float rect_center = 0.5+(x_mix-0.5)/4.0;
	float rect_w = 0.5;
	
	// testing if pixel sits in a rect
	if(st.x > rect_center-(rect_w/2.0) && st.x < rect_center+(rect_w/2.0)){
		in_rect = 1.0;
	}
	
	color = bkg;

	
	// discarding top and bottom
	float div_inc = 1.0/divs;
	if(st.y < div_inc || st.y > 1.0-div_inc){
		in_rect = 0.0;
	}
	
	// setting color for in rect
	if(in_rect == 1.0){
		color = vec3(0.0);
		float rect_x = (st.x - rect_center)*(1.0/rect_w);
		
		// ___ , rate , power , sin influence, sin rate, offset
		color.r = noise_val(rect_x, 3.0, 2.0, 2.0, 0.3, 4.0, 0.3);
		//color.r = color.r + noise_val(rect_x, 1.0, 5.0, 9.0, 0.3, 4.0, 0.56);
		
		color.g = noise_val(rect_x, 3.0, 2.0, 2.0, 0.3, 4.0, 0.33);
		
		color.b = noise_val(rect_x, 2.0, 2.0, 2.0, 0.3, 4.0, 0.31);
		
		color = mix(vec3(0.5),color,4.0);

	}
	
	// line in between rects


	gl_FragColor = vec4( color, 1.0 );

}