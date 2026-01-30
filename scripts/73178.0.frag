#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy * gl_FragCoord.x + resolution.xy ) + mouse / 444.0;
	vec2 te = position/gl_FragCoord.y;
		
	
	float fragz = 555.0/(gl_FragCoord.x*gl_FragCoord.x)/1115.0*gl_FragCoord.y*gl_FragCoord.x-gl_FragCoord.x/mouse.y;

	float color = 100.0/gl_FragCoord.x-fragz/resolution.x-fragz;
	float color2 = 5.0/mouse.x-mouse.y/resolution.x;
	float color3 = 11.0/mouse.y*gl_FragCoord.y;
	float colorn = -4.0-mouse.x*resolution.y/5.0/color*mouse.x-gl_FragCoord.y-fragz;
	float test =colorn/gl_FragCoord.y-mouse.x/gl_FragCoord.x/mouse.x-color2-mouse.x;
	float a =gl_FragCoord.x*mouse.y*color/445.0/color-color*gl_FragCoord.y/fragz-fragz;
	float max=color*color2*color3*colorn*test*a/a/a-color*5.0*fragz/mouse.x-fragz;


	gl_FragColor = vec4( vec3( cos(a-a/test/fragz)/sin(a/max-test)/tan(a*fragz/test/max-max-a*a/color-fragz)-sin(a*test-max)*sin(color2/a-fragz/colorn-test/colorn-max/a-a)*tan(fragz/color/a*max)-a-color3* tan(colorn-max/color), color *test/color- .5, sin( color2 /sin(color)*colorn / time-color / 3.0 ) * 0.75 ), 1.0 )/cos(color2)*sin(color3/time-color*color2/color3/13.0);

}