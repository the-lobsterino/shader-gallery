#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float rand(vec2 co){
return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);
}

int rand_range(vec2 co,int n){
return int(floor(rand(co)*float(n)));
}

float point(vec2 pos,vec2 p){
return step(distance(p,pos),0.002);
}

vec2 move_half(vec2 from,vec2 to){
return mix(from,to,0.5);
}

void main( void ) {

	vec2 pos = ( 2.0*gl_FragCoord.xy - resolution ) /min(resolution.x,resolution.y);
	
	vec3 color = vec3(0.0,1.0,0.0);
	
	vec2 vects[3];
	float T = 0.5;
	vects[0] = vec2(-1.73,-1.0)*T;
	vects[1] = vec2(1.73,-1.0)*T;
	vects[2] = vec2(0.0,2.0)*T;
	
	vec4 last = texture2D(backbuffer,gl_FragCoord.xy/resolution);
	vec2 d = texture2D(backbuffer,vec2(0)).xy*2.0-1.0;
	
	gl_FragColor = vec4(color*(point(pos,vects[0])+point(pos,vects[1])+point(pos,vects[2])), 1.0 );	
	gl_FragColor.rgb = max(clamp(gl_FragColor.rgb,0.0,1.0),last.rgb);
	gl_FragColor.rgb = max(gl_FragColor.rgb,color*point(pos,d));
	
	if(length(gl_FragCoord.xy) < 1.){		
		int n = rand_range(vec2(time)*vec2(0.031,0.019),3);
		if(n==0)
			d = move_half(d, vects[0]);
		else if(n==1)
			d = move_half(d, vects[1]);
		else if(n==2)
			d = move_half(d, vects[2]);
		gl_FragColor.xy = (d+1.0)*0.5;
	}
				
}