// Visual stim
// JH@KrappLab
// 2016-06-21
// http://glslsandbox.com/

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;


void main( void ) {
	
	
	
	
	float theta = 0.;
	float screenratio = 1.; // resolution.y/resolution.x;
	float spatialfreq = 4.;
	float v = .1;
	
	
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	vec3 destColor = vec3(0.0);
	
	destColor = vec3((sin((p.x*cos(theta*3.1415926/180.)+p.y*sin(theta* 3.1415926/180.)*screenratio+time*3.1415926*v)*(spatialfreq*2.)))); 

	gl_FragColor = vec4(destColor, 1.0);
}

