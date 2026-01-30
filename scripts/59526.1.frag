#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

float sq(vec2 uv,float posx, float posy,float size ) {
	
	        vec2 r=abs( uv - vec2(posx,posy)) ;
	        float s=step(0.1,max(r.x,r.y));
	         
		 
	
	return s ;
}
	
	
	

void main(){
	vec2 st = gl_FragCoord.xy/resolution.xy;
		st.x *= resolution.x/resolution.y;
	
	vec3 color = vec3(circle(st-vec2(0.5,0.0),0.9));
	
	       // make function	
	       // vec2 r=abs( st - vec2(0.5,0.5)) ;
	       // float s=step(0.1,max(r.x,r.y));
	       // float sq=s;
	
	float square = sq(st,1.0,0.5,0.2 );
	

	gl_FragColor = vec4( vec3( square*1.2,0.5 ,0.8)*color , 1.0 ) ;
}