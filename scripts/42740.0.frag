#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	//vec3 light_color = vec3(1.2,0.8,0.6);
	vec3 light_color = vec3(1, cos(time), sin(time));
	
	float t = time*-2.5;
	vec2 position = ( gl_FragCoord.xy -  resolution.xy*.5 ) / resolution.x;

	// 256 angle steps
	float angle = atan(position.y,position.x)/(1.5*3.14159265359);
	angle -= floor(angle);
	float rad = length(position);
	
	float color = 0.0;

	float angleFract = fract(angle*256.);
	float angleRnd = floor(angle*256.)+120.;
	float angleRnd1 = fract(angleRnd*fract(angleRnd*.7235)*45.1);
	float angleRnd2 = fract(angleRnd*fract(angleRnd*.82657)*13.724);
	float t2 = t+angleRnd1*100000.;
	float radDist = sqrt(angleRnd2);
	
	float adist = radDist/rad*.063;
	float dist = (t2*.1+adist);
	dist = abs(fract(dist)-1.0);
	color +=  (1.0 / (dist))*cos(0.7*(sin(t)))*adist/radDist/30.0;

	angle = fract(angle+.61);
	
	gl_FragColor = vec4(color,color,color,1.0)*vec4(light_color,1.0);
}