#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 res = resolution/10.2;
	vec2 position = ( (gl_FragCoord.xy - vec2(resolution.x/2., resolution.y/2.)) / max(res.y, res.x)  ) ;
	
	float x = position.x;
	float y = position.y;
	float u,t;
	float iv = 60.;
	
	for(int i=0;i<80;i++) {
		u =  -y*y*x*x +1.2*x*x + 1.1;
		t =  -x*x*y*y  +1.2*y*y + 1.1;
		
		
		x = u;
		y = t;
		if(dot(vec2(u,t), vec2(u,t))>15.08) {
			iv = float(i);
			break;
		}
		
	}
	
	vec3 color =  vec3(iv/60.)*11.;

	gl_FragColor = vec4(vec3(color.x/8., color.y/4., color.z/4.), 1.);
	

}