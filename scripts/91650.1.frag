#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	pos.x /= 0.505;
	vec3 color;
	float mytime = 0.5* time;
	
	float how = 2.0;
	
	//color += step(pos.y, 0.5);
	
	//color += abs(smoothstep( 0.9,1.0, abs(pos.y/pos.x))*2.0-1.0)/how;
	//color += abs(smoothstep( 1.0,1.1, abs(pos.y/pos.x))*2.0-1.0)/how;
	
	color += smoothstep(0.3,0.7,pos.x*step(pos.x,1.2));
	color.xy += step(sqrt(pow(pos.x-0.9,2.0)+pow(pos.y-0.8,2.0)),0.1);
	
	


	

	gl_FragColor = vec4( color/how, 0.9 );

}