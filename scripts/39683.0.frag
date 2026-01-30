#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

float xfloor(float a, float b){
	float n=a/b;
	return floor(n)*b;
}

void main( void ) {

	vec2 pos = gl_FragCoord.xy / resolution;
	float color = max( xfloor(pos.x,0.1) , xfloor(pos.y,0.1) ); // < - WHY DOES THIS CAUSE A DIAGONAL LINE ? 

	gl_FragColor = vec4( vec3(color), 1.0 );

}