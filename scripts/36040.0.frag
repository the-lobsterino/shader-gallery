#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 pos, float s){
	return smoothstep(s+0.02,s+0.01,length(pos))-smoothstep(s+0.01,s,length(pos));
}

void main( void ) {

	vec2 p =  gl_FragCoord.xy/resolution.xy ;
	
	float ratio =min(resolution.x/resolution.y,resolution.y/resolution.x);
	p-=0.5;
	p.x /= ratio;
	//p-=vec2(0.5,0.5ratio);
		//( gl_FragCoord.xy -0.5* resolution.xy)/resolution.y;
	
	float col = smoothstep(0.14,0.5,sin(length(p)*20.0+time)-(length(p*1.5)));
	
	
	gl_FragColor = vec4( vec3(0.5,0.0,0.5)*circle(p,sin(p.y*10.0+time)+sin(p.x*10.0))+vec3(0.0,1.0,0.5)*circle(p,0.43), 1.0 );

}
