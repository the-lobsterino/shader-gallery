#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	float i = 0.;
	//while(i<5.){i++;}
	for(int a=0;a>-1;a++){if(i<5.){i++;}else{break;}} //DANGER!!! OH NOOOO BITCHHHHHHHHHHHHHHHHHHHHHHHH WATCH OUT FOR THESE FLOATS
	gl_FragColor = vec4(vec3(i), 1.0 );

}