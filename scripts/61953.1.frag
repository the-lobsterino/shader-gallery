#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define blur 0.003
#define BLACK   vec3(0.0, 0.0, 0.0)
#define BLUE    vec3(0.0, 0.0, 1.0)
#define GREEN   vec3(0.0, 1.0, 0.0)
#define RED     vec3(1.0, 0.0, 0.0)
#define CYAN    vec3(0.0, 1.0, 1.0)
#define MAGENTA vec3(1.0, 0.0, 1.0)
#define YELLOW  vec3(1.0, 1.0, 0.0)
#define WHITE   vec3(1.0, 1.0, 1.0)

float circle(vec2 st, vec2 offSet, float radius) {
	
	float mask = 0.0;
	
	float d = distance(st, offSet);
	
	mask = smoothstep(radius + blur, radius - blur, d);

	return mask;
}

float smiley(vec2 uv, float size) {
	
	uv /= size;
    	//Face 
    	float r  = 0.5;
    	//Eyes
    	float r1 = 0.07;
    	//Mouth
    	float r2 = 0.2, r3 = 0.3;
    
    	float mask = 0.0;
	mask += circle(uv, vec2( 0.0, 0.0), r ); //Face
	mask -= circle(uv, vec2(-0.2, 0.2), r1); //Eye
	mask -= circle(uv, vec2(+0.2, 0.2), r1); //Eye

	float mouth = circle(uv, vec2(0.0, -0.2), r2); // Mouth    
    	float clip  = circle(uv, vec2(0.0, -0.2), r3); // Clip
    
    	//mouth -= clip;
    	mask -= mouth;
    
	return mask;
}


mat2 rotate(float angle) {
	return 	mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main( void ) {

	vec2 st =  gl_FragCoord.xy / resolution.xy - 0.5;
	st.x *= resolution.x / resolution.y;

	float angle = time / 2.;
	float zoom  = sin(time) * 3.0 + 5.0; 
	mat2 rotation = rotate(angle);
	
	st *= rotation;
	st *= zoom;
	st = fract(st);
	st -= 0.5;
	
	float x = st.x;
	float y = st.y;
	
	float mask = 0.0;
	
	vec2 temp_st = st;
	temp_st *= rotate(-angle);
	
	mask = smiley(temp_st, 0.5);
	
	vec3 color;
	
	color = YELLOW * mask;
	
	gl_FragColor = vec4( color, 1.0 );

}