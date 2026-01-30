#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.y*100. / resolution.xy )-0.9;
	float dy =50./(25.*length(p-vec2(p.x,0)));
	dy = cos(-dy)*(time*0.004)/exp(dy+0.35);
	gl_FragColor = vec4((p.x+0.8)*sin(dy*2000.0),(dy)*0.0,dy*0.0025,1.2 );
}
