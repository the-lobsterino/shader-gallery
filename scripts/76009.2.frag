#extension GL_OES_standard_derivatives : enable
//https://glslsandbox.com/e#75970.0
precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
	vec2 uv = ( gl_FragCoord.xy - resolution.xy * .5 ) / resolution.y;
	uv.y += time * .03;
	uv = (uv * 15. - fract(uv * 15.)) * 1.;
	float temp_x = 0.; 
	float R = .001;
	for (float i = 0.; i < 1.; i++) {
	//	temp_x = uv.x + .5 * sin(5. * cos(time * R + 41.) + uv.y * 4. + 2.1 * cos(5. + 2.4 * sin(time * R) * uv.x + uv.y * 2.1));
	//	uv.y = uv.y + .5 * sin(5. * sin(time * R) + uv.x * 5. + 4.1 * cos(9. + 2.4 * uv.y + uv.x * 1.92 * cos(time * R)));
	//	uv.x = temp_x;
	}
	float val = pow(1. - abs(sin(uv.x + uv.y)), 0.1);
//	vec3 color = vec3(sin(uv.x * 1.1 + uv.y * 2.1), cos(uv.x  * 2.1 - uv.y * 2.1), sin(uv.x * 3. + uv.y * 1.1)) * val;
	vec3 color = vec3(sin(uv.x * 1.1 + uv.y * 2.1), 0,sin(time)*0.1) * val;
	gl_FragColor = vec4( color  , 1.0 );

}