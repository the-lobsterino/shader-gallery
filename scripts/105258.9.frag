#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float MAX_ITER = 6.0;

float test2(float x){
	float iter = 1.0;
	float base = 0.0;
	float re = 0.0;
	for(float i=0.0; i < MAX_ITER; i++){
		float f = (-1.0*abs(sin(x/iter*3.141592))+1.0);
		re = re + f*iter*0.3;
		
		iter = iter / 2.0;
		base = base + iter;
	}
	
	return re;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy - 0.5 * resolution.xy ) / resolution.y;

	vec3 col = vec3(0.0);
	float mul = 1.0;
	float t = test2(uv.x*mul)+test2(uv.y*mul);
	
	
	col = vec3(0.0,0.0,0.0);
	col = mix(col,vec3(0.0,0.0,0.9), t*3.0+0.0);
	col = mix(col,vec3(1.0,0.0,0.0), t+0.1);
	col = mix(col,vec3(1.0,1.0,1.0), t-0.6);
	//col = col + t;

	gl_FragColor = vec4(col, 1.0);
	

}