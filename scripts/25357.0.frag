#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ellipse(vec2 p, vec2 center, float r) {
	float d = distance(vec2(p.x*0.5,p.y), vec2(center.x*0.5,center.y));
	return 2.0* d;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position = 2.0 * position - 1.0;
	position.x *= resolution.x / resolution.y;
        float color = 5.0;
	
	float x = -1.0;
	float y = 0.0;	
	float ca = ellipse(position, vec2(x, y), 0.2);
	

	x = 2.5 * fract(time/10.0)-2.0;
	y = 0.0;
	float cc = ellipse(position, vec2(-x, y), 0.3);
	
	color = ca  * cc;
	vec3 colornew=color*vec3(0.0,1.0,0.0);
	if(color<1.0)
	gl_FragColor = vec4( colornew, 1.0 );



}








