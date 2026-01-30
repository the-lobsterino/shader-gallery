#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / min(resolution.x,resolution.y) );
	vec3 color = vec3(0.0);
	// d= from sun		
	float d = distance(p,vec2(p.x));
		
	color = mix(vec3(0.45,0.45,1.0),vec3(0.1,0.8,1.0),p.y);//Sky	screen/2..bottom/top colors
	
	
	vec2 sun = vec2(0.75,0.50);
	
	d = distance(p,sun);
	
	if(sin(atan((p.y-sun.y)/(p.x-sun.x))*16.0+time*10.0) > 0.0)
		color = mix(color, vec3(1.0,1.0,0.0),clamp((1.0-d*.0),0.0,.8));//Sunbeams
	
	if(d < 0.045)// s dist
		color = vec3(1.0,1.0,0.0);
	
		
	
	gl_FragColor = vec4( color , 1.0 );

}