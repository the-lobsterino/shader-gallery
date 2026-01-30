#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 location = gl_FragCoord.xy / resolution.yy;
	bool a = fract(location.x*1.0) < 0.5;
	bool b = fract(location.y*1.0) < 0.5;
	if((a&&b) || (!a&&!b)){
		gl_FragColor = vec4(1.2,1.0,1.0,1.0);
	}else{
	        gl_FragColor = vec4(0.0,0.1,0.0,1.0);
	}
}