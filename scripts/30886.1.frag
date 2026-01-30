#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( ) {
	
	float scale = 20.0;
	vec2 center = ( gl_FragCoord.xy / resolution.xx ) * 20.0;
	float yx = resolution.y/resolution.x; 
	
	float total = 0.0;
	
	for(int i=0; i< 60; i++){
	
		vec2 position = vec2(10.0 + sin(time *  0.2 * float(i)) * 3.5, float(i) * 0.5);
		float luma = 1.0 - min(1.0,length(position - center));
		luma = pow(luma, 2.0);
		total += luma;
	}
	

	
	gl_FragColor = vec4(total);

}