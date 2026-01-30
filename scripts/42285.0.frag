#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec3 white=vec3(1,1,1);
	vec3 red = vec3(1,0,0);
	vec3 green = vec3(0,1,0);
	vec3 blue = vec3(0,0,1);
	vec3 yellow = vec3(1,1,0);
	vec3 lightblue = vec3(0,1,1);
	vec3 purple = vec3(1,0,1);
	vec3 grey = vec3(0.4,0.4,.4);
        vec3 black= vec3(0,0,0);
	vec3 color1=  green;
	vec3 color2= white;
	vec3 color3 = blue;
vec2 position = (gl_FragCoord.xy/resolution.xy);
	
	if(position.y < 0.43333333){
		gl_FragColor = vec4( color1, 1.0 );
	} 
	else if(position.y < 0.66666666){
		gl_FragColor = vec4(  color2,1 );
	} else {
		gl_FragColor = vec4(color3 ,1);
	}


}