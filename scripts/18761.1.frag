#ifdef GL_ES
precision mediump float;
#endif

uniform float time;uniform vec2 resolution;
float c(float t,vec2 p){
	return sin(sqrt(pow(.5-p.x,2.0)+pow(.5-p.y,2.0))*1E7+time*1E1+t);
}
void main(void){
	vec2 p=(gl_FragCoord.xy/resolution.xy)*0.000001;
	gl_FragColor = vec4(c(0.0,p),c(1.0,p),c(2.0,p),1);
}