precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

void main(void){
	 vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); // 正規化
	vec3 destColor=vec3(0.0,0.0,0.0);
	for( float i = 0.0 ;i<5.0;i++){
		 float j = float(i)+1.0;
		vec2 q=vec2(cos(time*j),sin(time*j))*0.5;
		q=fract(q)-0.5;
		destColor+=0.01/abs(length(p-q)-0.2);
	}
	
	gl_FragColor = vec4(destColor, 1.0);
	
	
	

}