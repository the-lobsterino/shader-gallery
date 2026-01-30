// GPU Particle
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define ParticleScale 10.0


float meta(vec2 uv, vec2 center);
	
void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	
	
	vec3 finalColor = vec3( 0.0555, 0.555, 1.0 );
	vec3 finalColor2 = vec3( 1.7, 1.0, 0.4 );
	vec3 finalColor3 = vec3( 1.0, 0.588, 0.235 );
	float multiplier = 0.05;
	
	vec2 b1 = vec2( sin(time), 0.0);
	vec2 b2 = vec2( sin(time*2.0), 0.0);
	float meta1 = meta(uv, b1) * multiplier;
	float meta2 = meta(uv, b2) * multiplier;
	
	
	vec3 color1 = finalColor3*meta1;
	vec3 color2 = finalColor*meta2;
	
	gl_FragColor = vec4(color1+color2, 1.0);

}


float meta(vec2 uv, vec2 center){
	return 1.0 / ((center.x-uv.x)*(center.x-uv.x) + (center.y-uv.y)*(center.y-uv.y));
}