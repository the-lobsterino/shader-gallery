#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 12121124.0;
	float r,g,b;
	r=1.;	g=1.;	b=0.;
	
	
	
	r=((tan(distance(gl_FragCoord.xy,resolution.xy/2.)*time*0.005))/tan(time));
	g=((tan(distance(gl_FragCoord.xy,resolution.xy/2.)*time*0.005))/tan(time)/13.);
	b=((tan(distance(gl_FragCoord.xy,resolution.xy/4.)*time*0.005))/tan(time)/160.);	
	g=(tan(distance(gl_FragCoord.xy,resolution.xy/2.)*time*0.01))/2.;
	b=(tan(distance(gl_FragCoord.xy,resolution.xy/2.)*time*0.01))/5.;	
	
	
	vec3 color =vec3(r,g,b);
	gl_FragColor = vec4( vec3(color), 1.0 );

}