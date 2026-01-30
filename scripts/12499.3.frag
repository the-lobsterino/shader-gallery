#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) -0.5;//+ mouse / 4.0;
//	float color = 0.0;
	
	float sx =0.2*(p.x+0.5)*sin(20.0*p.x-10.*time);
	float dy =1./(500.*abs(p.y-sx));//1/DICKE
	
	
	
	
	
	//gl_FragColor = vec4( vec3( .01, 0.8*dy ,dy*.4) ,1 );	
	float red =.01;
	float green =.8*dy;
	float blue = dy*10.;
	
	
	if (blue< .5){
		
		blue =.5*blue; //GLOW EFFEKT
	}
	
	
	
	
	
	
	
	
	
	gl_FragColor = vec4( vec3( red, green ,blue) ,1.0 );
	
	
	
}
	
void draw(){
	
	
}