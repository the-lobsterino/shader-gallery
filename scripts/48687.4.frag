#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float PI = 3.14159265358979;

vec3 color;

float cl;
float ans, zc;
float z, si;

const float num = 30.0;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );

	zc = length(vec2(pos.x-0.5, pos.y-0.5));
	
	
	for(float i=0.0; i < num; i++) {
		ans = length(vec2(pos.x-0.5+sin(time+PI*2.0*i/num)*0.3, pos.y-0.5+cos(time+PI*2.0*3.0*i/num)*0.3));
		
		z = 0.1;
		
		si = (zc*z);
		
		if(ans < si) {
			cl = pow((si-ans)/si+1.0, 6.0)/pow(2.0, 4.0);
			color += vec3(
				cl*0.8,
				cl*0.6,
				cl
			);
		}
	}
		

	gl_FragColor = vec4(color, 1.0 );

}