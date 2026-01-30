#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

void main( void ) {
	
	//look
	float intensity = 0.0001;
	float gamma = .3;
	vec4 sourceColor = vec4(1., .0, .0, 1.);
	
	//shape
	float radius = 0.1;
	vec2 center = vec2(0.6,0.4);
	
	
	
	
	vec2 currentPos = (gl_FragCoord.xy / resolution.x) + vec2(-0.2, 0.25) /4.0;
	radius += 0.2 * cos((atan(currentPos.y, currentPos.x)*10.+time));
	//currentPos += .01 * cos((gl_FragCoord.x / resolution.x) );
	float dist = (distance(currentPos, center))-radius;
	float distInverse=intensity/(dist*dist);
		
	
	vec4 color = vec4(sourceColor.rgb * vec3(distInverse), 1.);
	
	
	//glow
	//vec4 color = vec4(smoothstep(0., 1., distInverse));
	//vec4 tmpColor = mix((vec4(0.7,0.3,0.2,1.)*color),color,distInverse);
	
	gl_FragColor = pow(color,vec4(gamma));
}