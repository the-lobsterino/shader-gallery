#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;


float yellow(float x){
    
	return smoothstep(0.49,0.5/resolution.y,x)*1000.0;
}

void main( void ) {
    
	float siny = sin(gl_FragCoord.x/resolution.y*12.0-time*8.0);
	float x = gl_FragCoord.y/resolution.y -siny/300.0;
	gl_FragColor = vec4( yellow(x), yellow(x), .38, 1.0 )-siny/25.0;

}