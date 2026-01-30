#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define LIMIT 2.
#define STEPS 100.



vec3 col(vec2 uv) {
	
	vec2 z = vec2(0.);

	for(float i=0.; i<STEPS; i++) {
		z = vec2(z.x*z.x-z.y*z.y, 2.*z.x*z.y) + uv;
		if(length(z) > LIMIT) {
			return vec3(i/STEPS);
		}
	}
	
	return vec3(0.);
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	uv -=0.5;
	uv.x = uv.x * (resolution.x / resolution.y);
	uv *= 2./(time*time*time);
	// uv -=vec2(.737, 0.22);
	uv -=vec2(1.41, 0.);
	// uv +=vec2(1., 0.3);
	


	gl_FragColor = vec4(col(uv), 0.);

}