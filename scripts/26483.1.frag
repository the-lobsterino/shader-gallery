#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float color = 0.0;
	
	float loadtime = pow((1.+mouse.x), 5.) * 3.;
	
	float reltime = loadtime * fract(time/loadtime);
	
	float lLevel = min(sqrt(loadtime), reltime)/sqrt(loadtime);
	float rLevel = reltime/loadtime;
	
	if(position.x < .45) if(position.y < lLevel) color = 1.;
	if(position.x > .55) if(position.y < rLevel) color = 1.;
	
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}