#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;
#define p surfacePosition

uniform sampler2D backbuffer;
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	float color = 0.0;
	
	vec2 P = p;
	
	P = p + vec2(0.04, 0);
	
	float r = length(P);
	float a = atan(P.x,P.y);
	
	if(r < .255 && r > 0.245 && P.x < 0.1){
		color = 1.;
	}
	
	P = p + vec2(-0.125, 0.125);
	r = length(P)*2.;
	a = atan(P.x,P.y);
	
	if(r < .26 && r > 0.24 && (P.x > 0. || P.y < -0.033)){
		color = 1.;
	}
	
	P = p - vec2(0.125, 0.125);
	r = length(P)*2.;
	a = atan(P.x,P.y);
	
	if(r < .26 && r > 0.24 && (P.x < 0. || P.y > 0.0333)){
		color = 1.;
	}
	
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	
	gl_FragColor += (0.9+0.088*cos(time/4.))*(texture2D(backbuffer, (gl_FragCoord.xy-p*(4.+4.*cos(1024./length(p)+15.*time)))/resolution.xy)-gl_FragColor);
}

// (rb-cs-15)