#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = (gl_FragCoord.xy - resolution.xy/4.0 )*2.0;
	float r = pow(pow(gl_FragCoord.x-p.x,2.0)+pow(gl_FragCoord.y-p.y,2.0),2.0);
	r = r / 1000000.0;
	if(r<110.0-(gl_FragCoord.x+0.1)/(gl_FragCoord.y+0.1)+mouse.x*1000.0 && r>(80.0-mouse.y*100.0)){
		gl_FragColor = vec4( sin(time),cos(time*(mouse.y/100.0)),sin(time*(mouse.x/100.0)),1.0);
	}else{
		gl_FragColor = vec4( 0.5,0.5,0.5,1.0);
	}
	if(gl_FragCoord.x==resolution.x/2.0 || gl_FragCoord.y==resolution.y/2.0){
		gl_FragColor = vec4( sin(time),cos(time*(mouse.y/100.0)),sin(time*(mouse.x/100.0)),1.0);
	}
}