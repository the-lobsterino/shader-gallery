#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define control_mouse 0

#define speed 1.
#define tail 1



float x_func(float time){
	return sin(time);
}
float y_func(float time){
	return cos(time)+sin(time/3.);
}
void main(void) {
	vec2 uv = (gl_FragCoord.xy) /  resolution.xy;
    	vec2 scaled_coord = (uv-vec2(0.5,0.5))/.10; 
	
	float x = abs(scaled_coord.x-x_func(time*speed));
	float y = abs(scaled_coord.y-y_func(time*speed));
	float intersection = (1.-sqrt(x*x+y*y))/95. > 0.01 ? 1.0 : 0.0; 
	#if control_mouse == 1 
		float c = distance(uv, mouse) > 0.01 ? 1.0 : 0.0;
    		vec4 col = 1.-vec4(c);
    		gl_FragColor = col;
	#endif
	vec4 back = texture2D(backbuffer, uv);
	
	gl_FragColor.b = intersection;
	gl_FragColor.b += back.b - 0.01;
	gl_FragColor.r += back.b != 0.0 ? 1.0-back.b : 0.0;
	gl_FragColor.r += back.r /9.;
	#if tail == 1
		gl_FragColor.g += back.r * back.r >0.99 ? back.r/20.:0.;
		gl_FragColor.g += back.g;
		gl_FragColor.g = gl_FragColor.g > 0.2?0.2:gl_FragColor.g;
	#endif
}