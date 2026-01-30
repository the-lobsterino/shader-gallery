#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	vec2 uv=p;
	p=p*2.-1.;
	 
	vec3 col=vec3(5000);
	
	float f=0.0;
	
	f=1.-abs(p.y*5.0+(abs(p.x)+0.6)*sin(p.x*20.0-1.0*time*20.0));
	f*=f*f;
	f*=f*f;
	f*=f*f;
	col=vec3(25000.0,100.0,16.0)*f/50.0;

	gl_FragColor = vec4( col , 200.0 );

}