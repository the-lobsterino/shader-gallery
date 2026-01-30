#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( (gl_FragCoord.xy - vec2(resolution.x/2., resolution.y/2.)) / min(resolution.y, resolution.x)  ) ;
	float x = position.x;
	float y = position.y;
	float u,t;
	for(int i=0;i<70;i++) {
		u = x*y*y  - y*y+x +.008 * cos(time);
		t = y*x*x  - x*x+y +.008 * sin(time);
		
		
		x = u;
		y = t;
	}
	
	vec3 color =  vec3((x*y));

	gl_FragColor = vec4(vec3(color.x/8., color.y/2., color.z/1.), 1.);
	

}