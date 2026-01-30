#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 resoHalf = resolution * .5;
vec2 planetCenter = vec2(0.5)* resolution;
void main( void ) {

	vec2 position = gl_FragCoord.xy;
	
	
	float dis = distance(position, planetCenter);

	vec2 colour = dis/resoHalf;
	if(colour.y<0.9) {
	   gl_FragColor = vec4(0,0.3 + (sin(1.0-colour.y))*0.7,0,1);
		
	} else if(colour.y<1.0) {
	   float atmosphre = (colour.y - 0.9)*10.0;
	   gl_FragColor = vec4(0,0,sin(1.0-atmosphre),1);	
	} else {
	   gl_FragColor	= vec4(vec3(0.0),1.0);
	}

}