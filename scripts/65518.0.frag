#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float Pi = 3.140625;
const float K2 = 0.9330127;
const float K1 = 0.8660254;



void main( void ) {
	float dim = min(resolution.x, resolution.y);
	vec2 position =  8.0*(gl_FragCoord.xy - resolution.xy/2.0) / dim;
	float color = 0.0;
	vec2 positionp;
	position.x=position.x*K2-position.y/4.0;
	position.y=floor(position.y)*K2+position.x/4.0+fract(position.y);
	vec2 fracts = vec2(fract(position.x), fract(position.y));
	vec2 floors = floor(position);
	
	//position = vec2(floor(position.x)*K2-floor(position.y)/4.0, floor(position.x)/4.0+floor(position.y)*K2)*fract(position);
	
	
	
	if(fract(position.x)>0.5){
		fracts.y += (0.5-fracts.x)*.5;
		//fracts.x += (fracts.x-.5)*K1+0.5;
		
	}
	
	
	position = floors+fracts;
	
	
	/**
	if(fract(positionp.x)>0.5) {
		positionp.x += (fract(positionp.x)-0.5)*K1+0.5;
		positionp.y += (fract(positionp.x)-0.5)*0.5;
	} else {
		positionp.x += fract(positionp.x);
	}
	
	if(fract(positionp.y)>0.5) {
		positionp.x += ((0.5-fract(positionp.y))*0.5);
		positionp.y += (fract(positionp.y)-0.5)*K1+0.5;
	} else {
		positionp.y += fract(positionp.y);
	}
	**/
	positionp = position;
	color += (fract(positionp.x)>.95||fract(positionp.x)<.05)?0.5:0.0;
	color += (fract(positionp.y)>.95||fract(positionp.y)<.05)?0.5:0.0;
	color += (fract(positionp.x)>.49&&fract(positionp.x)<.51)?0.5:0.0;
	color += (fract(positionp.y)>.49&&fract(positionp.y)<.51)?0.5:0.0;
	color += (abs((0.5-fract(positionp.y))-(fract(positionp.x)-1.0))<.01)?0.5:0.0;
	color += (abs((0.5-fract(positionp.y))-(fract(positionp.x)-0.0))<.01)?0.5:0.0;
	color += (abs((0.5-fract(positionp.y))-(fract(positionp.x)-0.5))<.01)?0.5:0.0;
	gl_FragColor = vec4( vec3( color), 1.0 );

}