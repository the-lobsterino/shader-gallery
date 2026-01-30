#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float a=0.2 ;

void main( void ) {
	vec2 uv=(gl_FragCoord.xy/resolution.xy)*2.0-1.0 ;
	uv.x*=(resolution.x/resolution.y) ;
	
	
	vec2 m=mouse*2.0-1.0 ;
	m.x*=(resolution.x/resolution.y) ;
	
	vec3 color=vec3(0.07) ;
	
	for(float i=-1.0;i<1.0;i+=a){
		for(float j=-1.0;j<1.0;j+=a){
			if(m.x>i && m.x<i+a && m.y>j && m.y<j+a 
			  	&& uv.x>i && uv.x<i+a && uv.y>j && uv.y<j+a){
				color=vec3(0.0,0.0,abs(sin(time))) ;
			}
		}
	}
	
	if(abs(uv.x)>1.0){
		color=vec3(0.0,0.0,0.5) ;
	}
	
	
	
	
	gl_FragColor=vec4(color,1.0) ;

}

/*
Riemann 03-03-2018
b51b395f27f4c1933170c91168df29c02306a497e28c421984ac5a21c500675c

*/