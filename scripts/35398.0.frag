// Rectangle

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = p*2.0-1.0;
	p.x *= resolution.x / resolution.y;

	float size = (sin(time*4.0)*0.2+0.5); //0.3~0.7
	
	float col = 0.0;
	float recX = 1.0-abs(p.x);
	recX = step(size,recX);
	float recY = 1.0-abs(p.y);
	recY = step(size,recY);
	col = clamp(recX*recY,0.0,1.0);
	
	gl_FragColor = vec4( vec3( col ), 1.0 );

}