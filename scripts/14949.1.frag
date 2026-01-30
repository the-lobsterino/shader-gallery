#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy -  resolution.xy*.5 ) / resolution.x;

	position.x+=mouse.x-0.5;
	position.y+=mouse.y-0.5;
	
	// 256 angle steps
	float angle = atan(position.y,position.x)/(2.*3.14159265359);
	angle -= floor(angle);
	float rad = length(position);
	
	vec4 color = vec4(0.0);
	for (int i = 0; i < 50; i++) {
		float fi = float(i);
		float angleFract = fract(angle*256.);
		float angleRnd = floor(angle*256.)+1.;
		float angleRnd1 = fract(angleRnd*fract(angleRnd*.7235)*45.1);
		float angleRnd2 = fract(angleRnd*fract(angleRnd*.82657)*13.724);
		float t = time+angleRnd1*10.;
		float radDist = sqrt(angleRnd2+float(i));
		
		float adist = radDist/rad*.1;
		float dist = (t*.1+adist);
		dist = abs(fract(dist)-0.5);
		//color += max(0.,.65-dist*40./adist)*(.5-abs(angleFract-.5))*5./adist/radDist;
		color.b += max(0.,.5-dist*40./adist)*(.5-abs(angleFract-.5))*5./adist/radDist;
		color.g += max(0.,.5-dist*40./adist)*(.5-abs(angleFract-.5))*5./adist/radDist;
		
		
		angle = fract(angle+.61);
	}

	gl_FragColor = vec4( color )*.3;

}