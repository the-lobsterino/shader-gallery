#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


#define MAX_ITER 100
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 getColor(int iter) {
	
	return vec3(1.0) * (float(iter) /float(MAX_ITER));
	
}
int getIter(vec2 c) {
	vec2 z = c;
	for(int i = 0; i < MAX_ITER; i++) {
		z = vec2((z.x*z.x) -(z.y*z.y), 2.0 * z.x * z.y) + c;
		if(length(z) > 2.0) 
			return i;
	}
	return MAX_ITER;	
}

void main( void ) {

	
	vec2 uv = (gl_FragCoord.xy) /resolution.xy;
	uv = (uv -vec2(0.5)) * 2.0;


	
	uv*= 1.0 / mod(time, 1000.0);
		uv -= mouse;
		uv.x *= resolution.x/resolution.y;

	
	gl_FragColor = vec4(getColor(getIter(uv)), 1.0);

}