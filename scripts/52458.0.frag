#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 part1 = vec2(0.4,0.3);
	vec2 part2 = vec2(0.9,0.5);
	vec2 part1v = vec2(0.1,0.1);
	vec2 part2v = vec2(-0.1,0.0);

	part1=part1+part1v*time/1000.0;
	part2=part2+part2v*time/1000.0;
		
	vec3 color = vec3(.3, .3, .3);
        float p=mod(resolution.x,100.0)/100.0;
	if ((length(position-part1)<0.003) || (length(position-part2)<0.003)) color= vec3(1.0,1.0,1.0);
	//length(part1-part2)
	
	
	gl_FragColor = vec4( color , 1.0 );

}