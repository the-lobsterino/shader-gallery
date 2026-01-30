#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy/100.0-vec2(5,3);
	
	float iters=0.0;
	bool done=false;
	
	float a=position.x;
	float b=position.y;
	float origa=a;
	float origb=b;
	
	for(int x=0;x<10;x++){
		if(done)continue;
		if(a*a+b*b<0.1)done=true;
		else{
			float newa=a*a-b*b+origa;
			float newb=2.0*a*b+origb;
			a=newa;
			b=newb;
			iters+=0.1;
		}
	}
	gl_FragColor=vec4(iters,iters,iters,1.0);
}