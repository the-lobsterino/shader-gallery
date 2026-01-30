#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float y = sin(position.x * 100.0 + time*.05*sin(position.x) * 10.0);// / tan(time * 10.0* position.y);
	float color = 0.0;
	
	//adapt to 50, -50 y space
	float y50 = position.y * 100.0 - 50.0;
	
	
	if(y50 <= y + 0.05 && y50 >= y - 0.05){
		color = 1.0;
	}
	
	//smooth edges
	if(y50 <= y + 0.1 && y50 >= y + 0.05){
		color = 0.5;
	}
	if(y50 <= y - 0.05 && y50 >= y - 0.1){
		color = 0.5;
	}
	

	gl_FragColor = vec4( vec3(color), 1.0 );

}