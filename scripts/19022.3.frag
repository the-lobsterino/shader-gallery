#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution;
	float ratio = resolution.x / resolution.y;
	position.x *= ratio;

	//float time = surfacePosition.x * 8. + 8.;
	
	// Fond
	vec3 color = vec3(.5, .6, .8);
		
	// Atmosphère
	color += (1.-position.y)/4.;
	
	// Soleil :D
	float sunSize = 0.04;
	vec2 sunPosition = vec2(mod(time*0.3, 4.*ratio)-2.*ratio, .7);
	float sunDistance = distance(position, sunPosition);
	if (sunDistance < sunSize) {
		color = vec3(1.);
	}
	//color += max(1. - sunDistance*sunDistance, 0.)*0.3;
	

	// 4ème plan
	if (position.y < sin(-time*4.+position.x*32.)/160.+.375) 
	{
		color = vec3(0.35, 0.55, 0.8);	
	}

	// 3ème plan
	if (position.y < sin(-time+position.x*16.)/80.+.35) {
		color = vec3(0.3, 0.5, 0.6);	
	}
	
	// 2ème plan
	if (position.y < sin(time+position.x*8.)/40.+.3)
	{
		color = vec3(0.3, 0.5, 0.4);	
	}
	
	// 1er plan
	if (position.y < sin(time*2.+position.x*4.)/30.+.2)
	{	
		color = vec3(0.25, 0.45, 0.2);	
	}
	
	color.x += max(1. - sunDistance*sunDistance/3., 0.)*0.3;
	color.y += max(1. - sunDistance*sunDistance/3., 0.)*0.2;
	//color.z += max(1. - sunDistance*sunDistance, 0.)*0.0;

	gl_FragColor = vec4( color, 1.0 );

}