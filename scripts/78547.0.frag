#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//####################
//## Ashok Gowtham  ##
//####################

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ;

	
	float t = time;
	t = t * (1. + 0.0*(0.5+0.5*cos(t*.1)));
	
	vec3 color = vec3(0.0);
	color.r=.5+.4*sin(t*1.7);
	color.g=.5+.4*sin(t*1.3);
	color.b=.5+.4*sin(t);

	color = mix(color, vec3(0.2,.7,.99), 0.8-mouse.x);
	float f = 0.5;
	float x = 1.-abs(position.x-.5)*2.;
	
	x = x*1.005894931;
	f = x*(x>1.0?1.02+0.02*(.5+.5*sin(position.y*10.-t*10.)):1.0)*1.02;
//	f = exp(f);
	f=pow(f,20.*(1.-1.*(1.-position.y)
		     *(0.5+0.5*sin(position.y*10.*(1./(1.-position.y*.95))-t*10.))
		     *(0.5+0.5*sin(position.y*5.*(1./(1.-position.y*.95))-t*5.))
		     *(0.5+0.5*sin(position.y*2.5*(1./(1.-position.y*.95))-t*2.5))
		    ))+0.2;
	
	gl_FragColor = vec4( color*f, .5 );

}