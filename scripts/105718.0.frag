precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

void main(void){
	 vec2 p = (gl_FragCoord.xy * 2.5 - resolution) / min(resolution.x, resolution.y); // 正規化
	vec3 destColor=vec3(0.,1.0,0.0);
	for( float i = 1.55 ;i<
	    20.0;i++){
		 float j = float(i)+2.0;
		vec2 q=vec2(cos(time*j),cos(time*j))*0.5;
		destColor+=.01/abs(length(p-q)-0.2);
	}
	destColor=vec3(fract(destColor.x),0.,0.6);
	
	gl_FragColor = vec4(destColor, 2.0);
	
	
	

}