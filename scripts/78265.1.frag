#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// ---------------------

// challenge : coding in 15min

// licenced under piece, love and happiness

// ---------------------


#define PI 3.142

void main( void ) {

	vec2 pos = (( gl_FragCoord.xy / resolution.xy ) - 0.5) * 2.0;
	
	pos.x *= sin(time + pos.x);
	pos.y += sin(time*.1 + pos.x);
	
	pos.y +=sin(time*.004)*62.;
	
	pos.y +=cos(time*.14)*02.;
	
	float color = .5;
	
	float alpha = atan(pos.y, pos.x);
	float dist = length(pos) - time*.1;
	
	color = sin(3.1415*mod(dist, .913));
	
	 
	vec3 col = vec3(0.);
	
	col.x =   sin( time +  pos.x *.24 ) * 0.5 + color;
	col.y =   cos( time +  pos.y * 13. ) * 0.5 + color ;
	col.z +=   cos(pos.y*PI*26. + color );
	
	
	gl_FragColor = vec4( col, 2.0 );

}