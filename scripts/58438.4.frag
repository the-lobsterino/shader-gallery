#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {

	vec2 uv = (gl_FragCoord.xy-0.5*resolution)/resolution.y;
	uv *= 4.0;
	vec2 z = vec2(0,0);
	float color = 0.7;
	for(int i = 0; i < 50; i++){
	if(z.x*z.x + z.y*z.y >= 4.0) {
		color = 0.0;
		break;		
	  }	
	  z =vec2(z.x*z.x - z.y*z.y,2.0*z.x*z.y) + uv;
	  	
	  
	}
	
	gl_FragColor = vec4(vec3(color),1.0);
	

}