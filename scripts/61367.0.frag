#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main(void){
	
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 color = vec3(abs(sin(time / 2.) / 2.), 0.3, 0.5);
	
	float f = 0.0;
	float PI = 3.141592;
	for(float i = 0.0; i < 10.0; i++){
		
		float s = sin(time + i * PI / 25.) * .5;
		float c = cos(time + i * PI / 20.) * .5;
 
		f += 0.001 / ((p.x + c) * (p.y + s) );
	}
	
	
	gl_FragColor = vec4(vec3(f * color), 1.0);
}