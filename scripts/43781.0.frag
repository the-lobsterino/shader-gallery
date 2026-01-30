#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


mat2 Rotate(float angle)
{
	return mat2(cos(angle),-sin(angle),
		    sin(angle), cos(angle));
}

void main( void ) {
	vec3 light_color = vec3(2,2,2);
	
	float t = time * 1.0;
	vec2 position = ( gl_FragCoord.xy * 2.0 -  resolution.xy) / resolution.x;
	position *= Rotate(time - length(position)); 
	// 256 angle steps
	float angle = atan(position.y, position.x) / (3.14159265359);
	//angle -= floor(angle);
	float rad = length(position);
	
	float color = 0.0;

	float angleFract = fract(angle*256.);
	float angleRnd = floor(angle*256.)+100.;
	float angleRnd1 = fract(angleRnd*fract(angleRnd*.7235)*45.1);
	float angleRnd2 = fract(angleRnd*fract(angleRnd*.82657)*13.724);
	float t2 = t + angleRnd1*100.0;
	float radDist = sqrt(angleRnd2);
	
	float adist = radDist / rad * 0.1;
	float dist = (t2*.5+adist);
	dist = abs(fract(dist));
	color += radDist * ((1.0 / dist) * cos(sin(t)) * adist) / 30.0;  // cos(sin(t)) make endless.
	
	gl_FragColor = vec4(vec3(color) , 1.);
}