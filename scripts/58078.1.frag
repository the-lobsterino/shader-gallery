// alien signal
// jasonb.cz

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 v_uv;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy - resolution.xy ) + 1.3 / 3.3*sin(time*0.5);

	uv += 45.0*sin(time*0.35);
	
	vec3 finalColor = vec3 ( 0.12 *sin(time*0.22), 1.3*sin(time*0.32),1.07*sin(time*1.5) );
	
	float  v = abs(0.15 / (sin( (uv.x * uv.y*sin(time/2.1))/*sin(uv.y+time)*/* 3.14 *sin(time+11.2) ) /0.3*sin(time*1.5)));
	finalColor*=(v);
	


	gl_FragColor = vec4( finalColor, 1.0 );

}