#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy ); 
	p=p-vec2(mouse.x,-0.05);
	float color = 0.0;
	color+=atan(p.y,p.x);
	color+=p.y;
	color+=sin(5. *time+p.x+color*25.0)-1.0;
	color+=cos(15.*time+p.x+color*35.0)-1.0;
	gl_FragColor = vec4(  color,0, 0, 1.0 );
}