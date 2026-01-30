#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) -0.5 + mouse / 4.0;
//	float color = 0.0;
	
	float sx =0.2*(p.x+0.5)*sin(20.0*p.x-10.*time);
	float dy =1./(100.*abs(p.y-sx));//1/DICKE
	
	
	
	
	
	//gl_FragColor = vec4( vec3( .01, 0.8*dy ,dy*.8) ,1 );	
	float red =.01+9.*sin(.1*p.x);
	float green =.8*dy+0.1*sin(p.x);
	float blue = dy*5.+9.*sin(.1*p.x);
	
	
	//float red =.1;
	//float green =.1;
	//float blue =.1;
	
	if (blue< .5){
		
		//blue =*blue; //GLOW EFFEKT
	}
	//if ((p.y >((sin(time*10.))/2.+.1)&&p.y <(sin(time*.4))/2.)&&sin(p.x*100.+cos(p.y*tan(p.x)*6.)*30.)>.8){
	//	green *=3.;
	//}
	
	
	
	
	
	
	
	
	
	gl_FragColor = vec4( vec3( red, green ,blue) ,1.0 );
	
	
	
}
	
void draw(){
	
	
}