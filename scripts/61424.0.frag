#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// necips live

float hit_rect(vec4 a, vec2 p) {
	float c = 0.0;
	if (p.x > a[0] && p.x < a[2] && 
	    p.y > a[1] && p.y < a[3])
		c = 0.5;
	
	return c;
}


vec4 box[3];

bool init=true;
void main( void ) {

	if (init) {
		init = false;
		box[0] = vec4(0.1, 0.1, 0.2, 0.2);
		box[1] = vec4(0.3, 0.3, 0.5, 0.5);		
		box[2] = vec4(0.15, 0.15, 0.4, 0.4);		
	}
	
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) / 1.;

	float c=0.;
	for (int i=0;i<3;i++) {
		c += hit_rect(box[i], p);
	}
	
	gl_FragColor = vec4(vec3(c), 1.0 );

}