#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 coord = vec2(gl_FragCoord.x - resolution.x/2., gl_FragCoord.y - resolution.y/2.);
	
	vec2 newMouse = vec2(mouse.x * resolution.x - resolution.x/2., mouse.y * resolution.y - resolution.y/2.);
	
	
	float mouseRayLength = sqrt(pow(newMouse.x, 2.) + pow(newMouse.y, 2.));
	
	vec2 pressureVec = newMouse - newMouse / mouseRayLength * 100.;
	if(pressureVec.x * newMouse.x <= 0. && pressureVec.y * newMouse.y < 0.)
		pressureVec = vec2(0);
	
	float disFromLine = abs(coord.y - newMouse.y / newMouse.x * coord.x) / sqrt(1. + pow(newMouse.y / newMouse.x, 2.));
	
	float pressureStrength = 1. - pow(disFromLine / 100., 2.);
	if(pressureStrength < 0.)
		pressureStrength = 0.;
	
	if(pow(coord.x, 2.) + pow(coord.y, 2.) < pow(100., 2.) || pow(coord.x - pressureVec.x * pressureStrength, 2.) + pow(coord.y - pressureVec.y * pressureStrength, 2.) < pow(100., 2.))
		gl_FragColor = vec4(1., 1., 1., 1.);
	
	
	
	if(disFromLine <= 1. && pow(coord.x, 2.) + pow(coord.y, 2.) < pow(pressureVec.x, 2.) + pow(pressureVec.y, 2.))
		if(newMouse.x * coord.x > 0.0 && newMouse.y * coord.y > 0.0)
			gl_FragColor = vec4(1., 0, 0, 1.);
		
		
	
		
	

}