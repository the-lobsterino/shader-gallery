#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float pi=3.14159;

float g=-.001;

void main( void ) {
	
	float intensity = 0.;
	
	for (float i = 1.; i <128.; i++) {
		
		float angle = i/4. *0.05 *pi;
		
		vec2 xy = vec2( 4.*cos(sqrt(time*time/1625.*pi*angle)), 2.*sin(sqrt(i*time*time/5907.*pi*angle)) );
		
		xy += gl_FragCoord.xy/(resolution.x*0.3-3.7*sin(2.5*time/100.)/10.);
		
		xy += gl_FragCoord.xy/(resolution.y*1.)-1.5;
		
		intensity+= pow(i*i*2.5, (0.75 - length(0.15*xy) * 4.25) * (1. + 1.35 * fract((-i*i) / 100000.))) / 7000000.;
		
	}

	vec3 color = ( clamp(intensity * vec3(0.05+abs(sin(2.*time)), 0.2+abs(sin(1.*time)), 0.1+abs(sin(4.*time))), vec3(0.0), vec3(1.)) );

	gl_FragColor = vec4(color, 1.);  }