#ifdef GL_ES
precision mediump float;
#endif
//i did a modify -a sussy guy
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 1.0*( gl_FragCoord.xy / resolution.xy ) -0.5;
	vec3 col = vec3(0);
	
	for (int i = 0; i < 25; i++) {
		
		float a = 2.0*3.1415*float(i)/4.0/4.0+floor(p.y*12.0)/12.0+time*0.3;
		col += 1.0/(-1.0+10000.0*abs(p.x-0.1*cos(a))); 
	}
	gl_FragColor = vec4(col, 1.0);
}