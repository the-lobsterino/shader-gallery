#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//physical-based running animation. move your mouse to the right for a speed boost.

vec4 checker(vec2 position) {	
	
	position = fract(position);
	if (position.x < 0.5) {
		if (position.y < 0.5) {
			return vec4(0.8, 0.8, 0.8, 1.0);
		} else {
			return vec4(0.2, 0.2, 0.2, 1.0);
		}	
	} else {
		if (position.y < 0.5) {
			return vec4(0.2, 0.2, 0.2, 1.0);
		} else {
			return vec4(0.8, 0.8, 0.8, 1.0);
		}	
	}
}
void main( void ) {
	float walkrun = floor(mouse.x+0.5)*0.666+0.4;
	float stepfreq = mix(5.0, 7.5, walkrun);
	vec2 offp = vec2(sin((time)*stepfreq),-sin((2.0*time)*stepfreq));
	vec3 uprightjump = vec3((offp.y*0.015), offp.x*0.04, time*mix(2.0, 3.0, walkrun));
	vec2 p = ( gl_FragCoord.xy / resolution.xy * 2.0 - 1.0 ) * vec2( resolution.x / resolution.y, 1.0 ); 
	float z= 1.0 / abs(p.y+uprightjump.x);

	vec3 c = vec3(checker( ( vec2(p.x, p.y+2.0) * z + vec2(uprightjump.y, uprightjump.z) ) ) );//vec3(1.0/abs(p.y)*0.01);
	c *= pow(1.0 / z,2.0);
	vec2 cp = vec2(1.0, -0.5) - offp*vec2(mix(0.025, 0.12, walkrun),mix(0.03, 0.07, walkrun));
	if(distance(p,cp)<0.2)
	{
	//	c = vec3(0.0, 0.5, 1.0) * (0.9 + floor(fract(uprightjump.z)+0.5)*0.1);	
	}
	gl_FragColor = vec4( c, 1.0 );

}