#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float r = 0., g = 0., b = 0.;
	
	r = sin(time)*sin(position.x*time*12.)+cos(cos(position.y)*sin(time+5.))+sin(time*position.x);
	g = sin(position.x*10.+sin(time+12.))+cos(position.y*12.)+sin(position.x-tan(time));
	b = 1.-sin(position.y*150.)*cos(time*10.);
	
	if(tan(time) >= -1.)
	{
		r += .5;
		b = position.y;
	}

	gl_FragColor = vec4( vec3( r, g, b ), 1.0 );

}