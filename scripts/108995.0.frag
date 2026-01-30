#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float angle = 45.;

	vec2 uv = ( gl_FragCoord.xy / resolution.xy )*2.-1.; 
	uv.x *= resolution.x/resolution.y;
	uv *= mat2(2,0,0,2);
	uv *= mat2(cos(time),-sin(time),sin(time),cos(time));
	//uv.x *= sin(uv.y*abs(uv.x-fract(uv.y*2.))*10.);
	float right = 1.-abs(uv.x-uv.y)*4.;
	uv *= mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
	float left = 1.-abs(uv.x-uv.y)*4.;
	float result = 1.-(right*left);
	vec3 color = mix(vec3(sin(time)+1./2.,1.,0.),vec3(1.,0.,1.),result);
	gl_FragColor = vec4(color, 1.0 );

}