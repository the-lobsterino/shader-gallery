precision highp float;uniform vec2 resolution; 
void main(){
	float x=gl_FragCoord.x/resolution.x*3.;
	gl_FragColor=vec4(x>1.,x<2.&&x>1.,x<2.,1);
}