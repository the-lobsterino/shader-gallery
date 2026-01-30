#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy )-.5;
	uv.x *= resolution.x / resolution.y;
	vec3 finalColor = vec3(0.0);
	float t=time*5.;	
	float a=(atan(11.5)*(sin(uv.y/uv.x)));
	uv*=sin(8./sin(atan(a)*sqrt(12.)));
	uv*=log(8./inversesqrt(uv.x+(uv*.5)/t)*22.);	
	finalColor=abs(log2(sign(uv.x+t)*sin(length(uv*5.)-t))*vec3(0.01,0.1,0.9));
	finalColor*=vec3(1.0,0.9,0.6);
	gl_FragColor = vec4( finalColor , 1.0 );

}