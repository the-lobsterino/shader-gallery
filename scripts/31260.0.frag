#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p *= 4.0;

	for(int i = 0; i < 25; i++){
		p = abs(p - 1.0) * 1.2;
		p = vec2(cos(time)*p.x - sin(time) * p.y,sin(time) * p.x + cos(time) * p.y);
		
	}
	gl_FragColor = vec4(abs(sin(p)),0,1);

}