// optical illusion inspired from @coachly.de
// the discs are not changing in size or moving.

#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform float time;
uniform vec2 resolution;
#define PI 3.14159

void main( void ) {
	vec2 position = gl_FragCoord.xy/resolution.yy;
	bool isLeft = position.x<.5;
	
	if(position.x>1.) {
		gl_FragColor = vec4(.5);
		return;
	}
	position = mod( position, vec2(.5,1.) );
		
	float angle = atan(position.y-.5,position.x-.25)/2./PI;
	angle = 4.*mod(angle+time*2.25,1.);
	
	vec3 rgb = vec3(.5);
	float l=length(position-vec2(.25,.5));
	
	if(l>.13&&l<.2) {
		if ( angle<1.)   rgb=vec3(1,angle,0);// y to r					
		else if(angle<2.) rgb=vec3(2.-angle,1,angle-1.);// c to y
		else if(angle<3.) rgb=vec3(0,3.-angle,1);// b to c
		else rgb=vec3(angle-3.,0,4.-angle);// r to b
	}
	
	if(mod(time,10.)<5.) { // movement illusion
		float s=isLeft? abs(sin(time*8.)) : abs(cos(time*8.));		
		if(l>.1975&&l<.2)	rgb*=s;		// outer rim
		else if(l>.127&&l<.13)	rgb*=1.-s+.5;	// inner rim
	} else {	// grow / shrink illusion
		float s = PI*angle/4. + (isLeft? PI/2.*sin(time) : PI/2.*cos(time));
    		if(l>.1975&&l<.2) rgb *= .3 + abs(sin(s));  // outer rim
		else if(l>.127&&l<.13) rgb *= .3 + abs(cos(s)); // inner rim
	}
		
	gl_FragColor = vec4(rgb,1);
}