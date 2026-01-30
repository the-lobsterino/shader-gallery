#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution ;

// back buffer
uniform sampler2D b ; 

void main( void ) {
	vec2 uv=(gl_FragCoord.xy/resolution.xy)*20.0-10.0 ;
	uv.x*=resolution.y/resolution.x ;
	
	
	vec2 m=mouse*20.0-10.0 ;
	m.x*=(resolution.y/resolution.x) ;
	
	
	float x1=floor(m.x) ;
	float x2=ceil(m.x) ;
	float y1=floor(m.y) ;
	float y2=ceil(m.y) ;
	
	vec3 color=vec3(0.0) ;
	
	if(uv.x<=x2 && uv.x>=x1 && uv.y<=y2 && uv.y>=y1){
		color=vec3(0.0,0.0,1.0) ;
	}else{
		vec4 col=texture2D(b, vec2(gl_FragCoord.xy/resolution.xy)) ;
		col=col-vec4(0.0,0.0,0.02,0.0) ;
		if(col.z<=0.0){
			col.z=0.0 ;
		}
		color=col.xyz ;
	}

	
	
	
	
	
	
	gl_FragColor=vec4(color,1.0) ;

}

/*
Riemann 03-04-2018
b51b395f27f4c1933170c91168df29c02306a497e28c421984ac5a21c500675c

*/