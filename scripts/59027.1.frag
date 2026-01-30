	#ifdef GL_ES
	precision mediump float;
	#endif
	
	#extension GL_OES_standard_derivatives : enable
		
	precision mediump float;
	uniform float time;
	uniform vec2 resolution;


	void main(void){
	vec3 addColour =vec3(0.2, 0.0, 0.4);
	vec3 addColour2=vec3(0.0, 0.5, 0.5);
	
	vec2 p =(gl_FragCoord.xy *2.0 -resolution);
	p /= min(resolution.x,resolution.y);

	
	float y = 0.1/cos(sin(p.x*4.0 + tan(40.0 + time * 2.0)) + tan(p.y*2.0 + tan(4.0 + time * 2.0)));
	float y2= 0.5/cos(sin(p.y + tan(time)) + tan(p.x + tan(time)));
	
	vec3 destColour = addColour * y + addColour2 * y2;
	gl_FragColor =vec4(destColour,4.0);
}