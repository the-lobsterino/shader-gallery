precision highp float;
uniform vec2 resolution;
uniform float minexp;
uniform float maxexp;
//varying float MAX_ITERATIONS=minexp + 100.0;
void main( void ) {

float y = (gl_FragCoord.y / resolution.y) * (maxexp - minexp);
float x = (1.0 - (gl_FragCoord.x / resolution.x));
float row = floor(y) + minexp;

	for(float c = 0.0; c < 10.0; c++){
		if(c >= row){
		break;}
		x = x / 2.0;
	}
	
//for(float c = 0.0; c < row; c = c + 1.0) x = x * 2.0;
	for(float c = 0.0; c < 10.0; c++){
		if(c >= row){
		break;}
		x = x * 2.0;
	}
	
gl_FragColor = vec4(vec3(x), 1.0);
if (x == 0.0) gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
if (fract(y) > 0.9) gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);

}