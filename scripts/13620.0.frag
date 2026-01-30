#ifdef GL_ES
precision mediump float;
#endif

//SINUS by Green120

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) ;//+ mouse / 4.0;
	
	float ntime = 2.2+time; // get nice still in galery
	
	p.y *= p.x/4.0 + (3.0-p.y)/3.0*sin(ntime)*2.0;
	
	float red = 0.8570 * sin(p.x*3.14) * sin(p.y*50.0);
	
	float green = sin(ntime) * 0.570 * sin(p.x*13.414) * sin(p.y*50.0);
	
	float blue = sin(ntime) * sin(p.x*16.28) * sin(p.y*50.0);
	
	gl_FragColor = vec4( sin(p.x*3.14)*vec3( red, green ,blue) ,1.0 );
	
}
