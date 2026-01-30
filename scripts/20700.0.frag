// By: Brandon Fogerty
// bfogerty at gmail dot com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	//p.y += sin(time*10.0)*0.4*1./p.x* pow(p.x, 2.) + 0.2 * sin(p.x * time * 2.);
	p.y += 0.4*1./p.x* pow(p.x, 2.) + 0.2 * sin(p.x * time * 2.);
	
	vec3 c = vec3( 0.0 );
	
	float amplitude = 0.5; 
	float glowT = sin(time) * 0.5 + 10.5;
	float glowFactor = mix( 0.15, 0.35, glowT );
	c += vec3(0.02, 0.03, 0.13) * ( glowFactor * abs(1.0 /(p.y)));

	gl_FragColor = vec4( c, 1.0);


}