// GPU Particle
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define ParticleScale 110.0

void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;

	
if(mod(time*30.0,30.0) > 15.0){
	uv.x += atan(sin((time*300.0) +  gl_FragCoord.y)*0.03);
	}
	
	
	
	vec3 initColor = vec3( 1.0, 0.4, 1.0);
	vec3 finalColor = vec3( 2.0, 1.4, 1.0);
	
	float a = dot(initColor, finalColor);
	float d = distance(initColor, finalColor);
	float p = ParticleScale * sin(uv.y + a) ;
	
	
	finalColor *= abs( 1.0 / ( length(uv) * p) );
	//finalColor *= abs( 1.0 / ( sin( length(uv) * time) * ParticleScale ) );
	//finalColor *= abs( 1.0 / ( sin( length(uv) ) * ParticleScale ) );
	
	float t =  sin(time) * 0.5 + 0.5;
	finalColor *= mix(initColor, finalColor, t);
	
	gl_FragColor = vec4( finalColor, 1.0 );
	
			if(mod(time * 30.0,30.0) > 15.0){
gl_FragColor.r /= sin(gl_FragCoord.x + time +  tan(gl_FragCoord.y));
gl_FragColor.g /= sin(gl_FragCoord.x + time +  tan(gl_FragCoord.y));				

gl_FragColor.b /= sin(gl_FragCoord.x + time +  tan(gl_FragCoord.y));			
	}

}