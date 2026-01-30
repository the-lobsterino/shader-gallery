#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(vec2 pos) {
return fract(sin(dot(pos.xy, vec2(2., .3))) * 2.5453123);
}

void main( void ) {
	
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);	
    	p.x+=time*+.25;
	
	float color;
	color = 1.-random(p);	
		
	vec3 col = vec3(.15,.2,0.58);
	gl_FragColor = vec4( vec3(col*color), 1.0 );

}