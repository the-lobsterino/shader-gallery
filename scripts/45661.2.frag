#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv=(gl_FragCoord.xy/resolution.xy)*2.0-1.0 ;
	uv.x*=(resolution.x/resolution.y) ;
	
	
	
	
	vec2 m=mouse*2.0-1.0 ;
	m.x*=resolution.x/resolution.y ;
	
	vec3 color=vec3(0.07) ;
	
	//if(distance(uv,m)<0.2){
		//color=vec3(0.01/sin(distance(uv,m)),0.0,1.0) ;
		
		float d=abs(uv.x-(m.x/m.y)*uv.y)/sqrt(1.0+m.x*m.x/(m.y*m.y)) ;
		color=vec3(0.0,0.0,0.01/d) ;
		
	//}
	
	
	

	
	
	
	
	
	gl_FragColor=vec4(color,1.0) ;

}

/*

Riemann 03-05-2018
b51b395f27f4c1933170c91168df29c02306a497e28c421984ac5a21c500675c
*/