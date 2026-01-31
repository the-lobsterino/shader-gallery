precision highp float;uniform vec2 resolution;	
void main(){
	vec4 p=gl_FragCoord/resolution.y;float t=min(p.x,.8)*.6+abs(p.y-.5);
	gl_FragColor=t<.3?p*0.:t<.37?vec4(1,.7,0,1):t<.65?vec4(0,.47,.3,1):t<.72?p/p:p.y<.5?vec4(0,0,.6,1):vec4(.88,.2,.2,1);
}