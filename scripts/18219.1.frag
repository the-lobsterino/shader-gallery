#ifdef GL_ES
precision mediump float;
#endif
uniform float time;uniform vec2 mouse;uniform vec2 resolution;
void main( void ) {
	vec2 p=(gl_FragCoord.xy-.5*resolution)/min(resolution.x,resolution.y);
	vec2 o = vec2(0,0); // x / y offset
	vec3 c = vec3(0);
	float time = time;
	for (float i=0.; i<3.; i++) {
		float a = 3.141592/2. + 3.141592 * 2. * i / 3. + time;
		vec2 pt = vec2(cos(a), sin(a)) * (0.2 + 0.2*sin(time*2.));
		float dist = length(p-pt);
		time += dist*cos(time*4.2)*10.;
		c += 0.015/dist*vec3((i==0.)?1.:0., (i==1.)?1.:0., (i==2.)?1.:0.);
	}
	
	gl_FragColor = vec4(c,1);
}