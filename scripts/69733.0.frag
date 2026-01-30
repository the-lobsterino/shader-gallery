// Christmas abstraction, green pine needles, white snow, red 
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec3 col = vec3(0.0);
	for (float i=0.; i<10.; i++)
	{
		vec2 p = gl_FragCoord.xy/resolution.x*1.85 
			- .35*vec2( 1.+sin(i+time/4.), 1.+cos(i+time/4.) );
		
		float a = atan(p.y, p.x);
	
		col.x += length(p) +
			 sin( a*15.0 +sin(3.0*time/2.) ) ;
	
		if (col.x < 0.) col.y = -col.x;

		col.x = pow (.5*col.x, 14.5);
	}
	col = col+pow(clamp(1.-distance(col,vec3(0)),0.,1.),40.);
	gl_FragColor = vec4(col, 1.0);

}