#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere(vec3 p, float size){
	
	return length(p) - size;	
}

float map(vec3 p){
	
	p = mod(p, 3.0) - 1.5;
	
	float d1 = sphere(p,1.0);
	float d2 = sphere(p + vec3(1.0),1.0);
	
	return d1;
}


void main( void ) {

        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy ) / min(resolution.x,resolution.y);
	vec3 ro = vec3(.0,.0,-10.);
	float screenZ = 1.0;
	vec3 rd = normalize(vec3(uv,screenZ));
	
	vec3 col = vec3(0.0);
	float depth = 0.0;
	vec3 rPos = ro;
	
	for(int i = 0; i < 99; i++){
		float d = map(rPos);
		
		if(d < 0.00001){
			col = vec3(float(i) / 99.);
			break;
		}
		
		
		depth += d;
		rPos = ro + rd*depth;
	}


	gl_FragColor = vec4( vec3( col), 1.0 );

}