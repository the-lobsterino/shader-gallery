	#ifdef GL_ES
	precision mediump float;
	#endif
	
		
	precision mediump float;
	uniform float time;
	uniform vec2 resolution;


	void main(void){
	vec3 rColor =vec3(0.,1,0.0);
	
	vec2 p =(gl_FragCoord.xy *2.0 -resolution);
	p /= min(resolution.x,resolution.y);

	float a = sin(p.x *3.9 -time*0.9)/1.0;
	
	float e =0.009/abs(p.y+a);
	
	
	vec3 destColor = rColor*e;
	gl_FragColor =vec4(destColor,1.0);
}