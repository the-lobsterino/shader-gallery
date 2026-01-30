


precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	if(gl_FragCoord.y  / resolution.y < 0.5){
		gl_FragColor = vec4(0,0,1,1);
	}else if(gl_FragCoord.y / resolution.y >= 0.5){
		gl_FragColor = vec4(1,1,1,1);
	}

}