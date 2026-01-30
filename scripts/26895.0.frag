#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec3 lightAttenuation = vec3(0.8,1.0,0.7);
	vec3 lightColor = vec3(0.0,0.0,0.4);
	vec2 pixel=gl_FragCoord.xy;		
	pixel.y=resolution.y-pixel.y;	
	vec2 aux=vec2(mouse * resolution)-pixel;
	float distance=length(aux);
	float attenuation=1.0/(lightAttenuation.x+lightAttenuation.y*distance+lightAttenuation.z*distance*distance);	
	vec4 color=vec4(attenuation,attenuation,attenuation,1.0)*vec4(lightColor,1.0);	
	gl_FragColor = color;

}