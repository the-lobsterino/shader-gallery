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
	float dy =1./(1000.*abs(p.y-sx));//1/DICKE
	
	//float sx2 =0.5*(p.x+0.0)*cos(20.0*p.x-1.*time); 
	//float dy2 =1./(500.*abs(p.y-sx2));//1/DICKE
	
	
	
	
	//gl_FragColor = vec4( vec3( .01, 0.8*dy ,dy*.11) ,1 );	
	float red =.0;
	
	float blue =dy*5.;
	float green =blue/.3;
	
	float px = .0;
	
	if (p.x<.0){	
	px =p.x*(-1.);
	}
	
	if (p.x>.0){
	blue +=sin(p.x/2.);
	green += p.x/12.;
	//red +=sin(p.x/.5);
	}
	
	
	

	
	if (blue< .01){
	
		blue -=0.4; //GLOW EFFEKT #1
	}
	if (blue> .01){
	
		blue -=0.4; //GLOW EFFEKT #2
	}
	
	

	
	
	
	
	
	
	
	
	
	
	gl_FragColor = vec4( vec3( red, green ,blue) ,1.0 );
	
	
	
}
