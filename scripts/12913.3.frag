#ifdef GL_ES
precision mediump float;
#endif

//SINUS by Green120

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) -0.5;//+ mouse / 4.0;
//	float color = 0.0;
	
	float sx =0.2*(p.x+0.5)*sin(20.0*p.x-2.*time); 
	float dy =1./(500.*abs(p.y-sx));//1/DICKE
	
	float sx2 =0.5*(p.x+0.0)*cos(20.0*p.x-1.*time); 
	float dy2 =1./(500.*abs(p.y-sx2));//1/DICKE
	
	
	
	
	//gl_FragColor = vec4( vec3( .01, 0.8*dy ,dy*.4) ,1 );	
	float red =.3*sin(time*0.3)+dy2*10.;
	float green =.0000125*sin(time);
	float blue =dy*10.;
	

	
	if (blue< .01){
	
		blue -=0.4; //GLOW EFFEKT
	}
	
	

	
	
	
	
	
	
	
	
	
	
	gl_FragColor = vec4( vec3( red, blue/0.3+green ,blue/2.) ,1.0 );
	
	
	
}
	
void draw(){
	
	
}