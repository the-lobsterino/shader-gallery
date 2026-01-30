precision mediump float;
uniform float time; // time 
uniform vec2  resolution; // resolution

void main(void){
	float xRatio = gl_FragCoord.x / resolution.x;
	float yRatio = gl_FragCoord.y / resolution.y;
	
	bool leftEdge =  xRatio > 0.35 && xRatio < 0.4;
	bool rightEdge = xRatio > 0.65 && xRatio < 0.7;
	bool topEdge = yRatio > 0.35 && yRatio < 0.4;
	bool bottomEdge = yRatio > 0.65 && yRatio < 0.7;
	
	
	
	if(leftEdge || rightEdge || topEdge || bottomEdge) {
		gl_FragColor = vec4(gl_FragCoord.x / resolution.x, 0 , 0 , 1.0);
	}else {
		gl_FragColor = vec4(0,0,0,0);
	}
	
	
	
}