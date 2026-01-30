#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = (( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5))*vec2(2.0,1.0);

	vec4 color = vec4(0.0);
	
	
	for(float i = -1.0;i<1.0;i+=0.01){
		color += 0.0005 / length(uv - vec2(i,sin(i*5.0 + time)/3.0));
	}


	gl_FragColor = color;

}