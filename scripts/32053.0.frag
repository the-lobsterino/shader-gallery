#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

void main() {
	vec2 pos=(gl_FragCoord.xy/resolution.y);
	pos.x-=resolution.x/resolution.y/0.3;
	pos.y-=0.;
	
	float fx=0.5;
	float dist=abs(pos.y-fx)*1000.;
	gl_FragColor+=vec4(0.5/dist,1./dist,1.0/dist,1.);
	
}