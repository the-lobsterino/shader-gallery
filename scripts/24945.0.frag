#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( (gl_FragCoord.xy - vec2(resolution.x/2., resolution.y/2.)) / max(resolution.y, resolution.x)  ) ;
	float x = position.x;
	float y = position.y;
	float u,t;
	
	const int iterceil = 128;
	int iterlim = int(float(iterceil)*cos(time)*cos(time));
	for(int i=0;i<iterceil;i++) {
		if(i > iterlim) break;
		u = x*y*y  - y*y+x +.008;
		t = y*x*x  - x*x+y +.008;
		
		
		x = u;
		y = t;
	}
	
	vec3 color =  vec3((x*y));

	gl_FragColor = vec4(vec3(color.x/8., color.y/2., color.z/1.), 1.);
	

}