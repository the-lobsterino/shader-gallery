#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	float c = uv.x;
	for (float i = 1.; i < 5.; i++) { //Limited version
		if (uv.x < 1./pow(2.,i)) {
			c = uv.x*pow(2.,i);
		}
	}
	float b = floor(-log2(uv.x)); //Infinite version
	gl_FragColor = vec4(c,uv.x*pow(2.,b),0., 1.0 );
}