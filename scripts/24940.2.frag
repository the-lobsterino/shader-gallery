#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( (gl_FragCoord.xy - vec2(resolution.x/2., resolution.y/2.)) / max(resolution.y, resolution.x)  ) ;
	mat2 rot;
	float ang = -45. * 0.0174532925;
	rot[0] = vec2(cos(ang), -sin(ang));
	rot[1] = vec2(sin(ang), cos(ang));	
	position*=rot;
	float x = position.x;
	float y = position.y;
	float u,t;
	for(int i=0;i<62;i++) {
		u = x*y*y  - y*y+x +.008;
		t = y*x*x  - x*x+y +.008;
		
		
		x = u;
		y = t;
		if(float(i)>mod(time*30., 80.)) {
			break;
		}
	}
	
	vec3 color =  vec3((x*y));

	gl_FragColor = vec4(vec3(color.x/8., color.y/2., color.z/1.), 1.);
	

}