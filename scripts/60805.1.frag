#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

varying vec2 surfacePosition;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void){
	
	vec2 p = surfacePosition*2.;
	
	float time = time + length(p)*cos(time/4. - 0.04*length(p)*cos(time*time/8. + 0.0002*length(p)*cos(time*time*time/16.)));
	vec3 color = vec3(0.0, 0.3, 0.5);
	
	float f = 0.0;
	float PI = 3.141592;
	for(float i = 0.0; i < 20.0; i++){
		
		float s = sin(time + i * PI / 10.0) * 0.8;
		float c = cos(time + i * PI / 10.0) * 0.8;
 
		f += 0.001 / (abs(p.x + c / (1.+length(p))) * abs(p.y + s / (1.+length(p)))) / (1.+length(p));
	}
	
	
	gl_FragColor = vec4(vec3(f * color), 1.0);
}