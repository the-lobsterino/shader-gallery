precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

void main(void){
	 vec2 p = (gl_FragCoord.xy * 2.5 - resolution) / min(resolution.x, resolution.y)+vec2(cos(time)-0.3,0); // 正規化
	vec3 destColor=vec3(0.,1.0,0.0);
	for( float i = 1.25 ;i<
	    10.0;i++){
		 float j = float(i)+2.0;
		vec2 q=vec2(sin(time*j),cos(time*j))*0.5;
		destColor+=.01/abs(length(p-q)-0.2);
	}
	
	
		for( float i = 1.25 ;i<
	    30.0;i+=10.){
		 float j = float(i)+2.0;
		vec2 q=vec2(cos(j),sin(j));
		destColor+=cos(time)*0.2/abs(length(p));
	}
	
	
	
		for( float i = 10. ;i<
	    20.0;i++){
		 float j = float(i)+2.0;
		vec2 q=vec2(cos(time/10.*j)*cos(time/10.)*10.,cos(time*j))*0.5;
		destColor+=.01/abs(length(p-q)-0.2);
	}
	
			for( float i = 10. ;i<
	    20.0;i++){
		 float j = float(i)+2.0;
		vec2 q=vec2(cos(time/10.*j),cos(time/10.*j))*cos(time)*10.;
		destColor+=.01/abs(length(p-q)-0.2);
	}
	
	

	
	destColor=vec3(fract(destColor.x),0.,0.6);
	
	gl_FragColor = vec4(destColor, 2.0);
	
	
	

}