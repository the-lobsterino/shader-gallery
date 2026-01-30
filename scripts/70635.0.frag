#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
uniform vec2 mouse;
varying vec2 surfacePosition;
uniform vec2 resolution;
 
void main( void ) 
{
	float e = resolution.x*0.1; 
	float b = e*0.6;              
	vec2 m = resolution*vec2(0.5); 
	m.x += ((gl_FragCoord.x<m.x)?-e:e)*1.05; 
	vec2 t = mouse*resolution-m;
	m -= gl_FragCoord.xy;
	vec4 FragColor1 = vec4(min(e-length(m),length(m+t/max(2.0,length(t)/(e-b*mouse.y*2.0)))-b*mouse.y*2.0));
	FragColor1.xy = FragColor1.xy * mouse.xy;
 
	gl_FragColor = FragColor1 ;
	
}