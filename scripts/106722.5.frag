#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 res; //The width and height of our screen 
uniform sampler2D bufferTexture; //Our input texture 
void main() {
	vec2 pixel = gl_FragCoord.xy / res.xy;
	gl_FragColor = texture2D( bufferTexture, pixel );
	float dist = distance(gl_FragCoord.xy, res.xy/2.0);
	if(dist < 15.0){ //Create a circle with a radius of 15 pixels 
	gl_FragColor.rgb += 1.;
	}
	
}