#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float get_ball(vec2 uv, float x, float y){
	if (length(uv-vec2(x, y))<0.02) {
		return 1.0;
	}
	return 0.0;
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy);
	float backbuff = texture2D(backbuffer, uv).r;
	float aspect_ratio = resolution.x/resolution.y;
	uv.x *= aspect_ratio;
	
	//background
	const float bgval = 0.05;
	vec3 fcolor = vec3(bgval);
	
	
	//ball
	float x = mod(time*aspect_ratio*0.2, aspect_ratio);
	float y = mod(time*0.5, 2.0);
    	y = abs(y-1.0);
	
	float ball_1 = get_ball(uv, x,  pow(y, 2.0));
	float ball_2 = get_ball(uv, x, -pow(y, 2.0)+y*2.0);
	
	
	//trail
	float trail = 0.0;
	if(mod(time*aspect_ratio*0.2, aspect_ratio*4.0)<=0.01) { //clear
		trail = 0.0;
	}
	else if (backbuff >= 0.2) {
		trail = 1.0;
	}
	
	fcolor = mix(fcolor, vec3(0.8), ball_1+ball_2+trail*0.3);
	
	
	gl_FragColor = vec4(fcolor, 1.0);
}