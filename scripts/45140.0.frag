#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//Simple Voronoi

void main( void ) {
	
	vec2 uv=(gl_FragCoord.xy/resolution.xy)*2.0-1.0 ;
	uv.x*=(resolution.x/resolution.y) ;
	
	//Seeds
	vec2 points[5];
	points[0]=vec2(-0.7,0.1) ;
	points[1]=vec2(0.2,0.3) ;
	points[2]=vec2(.78,-0.42) ;
	points[3]=vec2(-0.7,-0.19) ;
	points[4]=vec2(0.0,0.1) ;
	
	vec3 color=vec3(0.2) ;
	float dis=distance(uv,points[0]) ;
	
	//Finding minimum distance of current point(pixell)
	//this way we find to which field belongs current uv.xy Pixel
	for(int i=0;i<5;i++){
		float dis2=distance(uv,points[i]) ;
		if(dis2<dis){
			dis=dis2 ;
			color=vec3(float(i)/10.0,cos(float(i)),sin(float(i))) ;
		}
		
	}
	gl_FragColor = vec4(color, 1.0 );

}