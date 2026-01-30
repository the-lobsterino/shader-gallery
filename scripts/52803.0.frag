#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position=gl_FragCoord.xy/resolution.xy;
	float color=0.0;
	
	color+=sin(position.x*sin(time/15.0)+cos(position.x*time/85.0)*cos(time/15.0)*10.0);
	color+=sin(position.y*sin(time/15.0)+position.y*cos(time/15.0)*5.0);
        color *= sin( time / 15.0 ) *0.5;
	gl_FragColor=vec4(sin(color/time),color/time,color,1.0);
}