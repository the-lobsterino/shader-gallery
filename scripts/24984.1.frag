#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 res = resolution/6.2;
	vec2 position = 2.22*surfacePosition;//( (gl_FragCoord.xy - vec2(resolution.x/2., resolution.y/2.)) / max(res.y, res.x)  ) ;
	
	float x = position.x;
	float y = position.y;
	float u,t;
	float iv = 60.;
	
	for(int i=0;i<80;i++) {
		u =  -y*y*x*x -2.*x*x+.92+1./(cos(time-x*y)+sin(time-x*y))-.0;
		t =  -x*x*y*y  -2.*y*y+.92+1./(cos(time+x*x)+sin(time+y*y)) -0.0;
		
		
		x = u;
		y = t;
		if(dot(vec2(u,t), vec2(u,t))>1e6) {
			iv = float(i);
			break;
		}
		
	}
	
	vec3 color =  vec3(iv/60.)*1e2;//vec3((x*y))*100.;

	gl_FragColor = vec4(vec3(color.x/8., color.y/4., color.z/4.), 1.);
	

}