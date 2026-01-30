// WonkyKIM
// https://vimeo.com/WonkyKIM
// https://www.facebook.com/WonkyKIM

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



vec2 fract2(vec2 z, vec2 p){  // z^2
	return vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + p;
}

vec2 fract3(vec2 z, vec2 p){  // z^3
	return vec2(z.x*z.x*z.x - 3.0*z.x*z.y*z.y, 3.0*z.x*z.x*z.y - z.y*z.y*z.y) + p;	
}

vec2 fract4(vec2 z, vec2 p){  // z^4
	return vec2(z.x*z.x*z.x*z.x - 4.0*z.x*z.x*z.y*z.y + z.y*z.y*z.y*z.y, 4.0*z.x*z.x*z.x*z.y - 4.0*z.x*z.y*z.y*z.y) + p;	
}

vec2 fract5(vec2 z, vec2 p){  // z^5
	return vec2(z.x*z.x*z.x*z.x*z.x - 8.0*z.x*z.x*z.x*z.y*z.y + 5.0*z.x*z.y*z.y*z.y*z.y, 5.0*z.x*z.x*z.x*z.x*z.y - 8.0*z.x*z.x*z.y*z.y*z.y + z.y*z.y*z.y*z.y*z.y) + p;	
}

vec2 fract22(vec2 z, vec2 p){ // z = (a - bi)
	return vec2(z.x*z.x + z.y*z.y, 2.0*z.x*z.y);
}

vec2 fract222(vec2 z, vec2 p){ // z = (-a + bi)
	return vec2( z.x*z.x + z.y*z.y, -2.0*z.x*z.y ) + p;
}


void main( void ) {

	vec2 p = gl_FragCoord.xy / resolution.xy;
	p = p * 2.0 - 1.0;
	p.x *= resolution.x / resolution.y;
	
	vec2 ms = mouse.xy * 2.0 - 1.0;
	ms.x *= resolution.x / resolution.y; 
	
	vec2 z = vec2(0.0);
	z = p;

	
	for (int i = 0; i<5; i++){
		//z = fract2(z, ms);
		//z = fract3(z, ms);
		//z = fract4(z, ms);
		//z = fract5(z, ms);
		z = fract2(fract5(z, ms), fract3(z, ms));
		//z = fract22(z, ms);
		//z = fract222(z, ms);
	}
	//z -> -1 ~ 1

	
	//float col = length(z);
	float col = 0.5 + 0.5 * z.y;
	
	//gl_FragColor = vec4( vec3(sin((0.5 + 0.5 * z.x) * 3.14 * 100.0), 0.5 + 0.5 * z.y, col), 1.0);
	vec3 jset = vec3(sin((0.5 + 0.5 * z.x) * 3.14 * 100.0), 0.5 + 0.5 * z.y, col);
	
	z = z * 0.5 + 0.5;
	vec3 temp = vec3(cos(z.x * 3.14 * 100.0), sin((z.y*3.14*100.0)), z.x+z.y);
	
	vec3 fc2 = vec3(0.0);
	fc2 = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), jset);
	
	gl_FragColor = vec4( temp, 1.0);
	

}