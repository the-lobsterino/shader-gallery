#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy )*1.-0.21;
	
	position.x*=resolution.x/resolution.y;
	
	
	const int num=15;
	vec3 col;
	float dis=0.1;
	for(int i=0;i<num;i++){
		for(int j=0;j<num;j++){
			vec2 px=vec2(abs(sin(float(i)*1121.121+133.6767)),
				     abs(cos(float(j)*3971.121+77953.112123)));
			px=vec2(rand(vec2(i,j)), rand(vec2(j*137,i*731)));
			vec2 p=px/float(num)+vec2(i,j)/float(num);
			float disP=distance(p, position)+.075;
			if(disP<dis){
				dis=disP;
			}
		}
	}
	
	col.b+=abs(1.0-.10/dis*(0.2+abs(sin(2.0))));
	col.r+=abs(1.0-.10/dis*(0.2+abs(sin(4.0))));
	col.g+=abs(1.0-.10/dis*(0.2+abs(sin(8.0))));
	
	col.b*=col.b*col.b*col.b*col.b;
	

	gl_FragColor = vec4( col,1.0);

}