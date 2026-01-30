#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//hello Xamin my old friend

bool isInside(float x, float y, float a){
    return pow(-pow(a,2.0) + pow(x,2.0) + pow(y,2.0), 3.0) <= a*pow(x,2.0)*pow(y,3.0);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 mousePos = ( mouse / resolution.xy );

	if(isInside(gl_FragCoord.x + resolution.x/2., gl_FragCoord.y + resolution.y/2., 10.)){
		gl_FragColor = vec4(255.,0.,0.,255.);
	}
	if(abs(position.x - position.y) < 0.01){
		gl_FragColor = vec4(255,0.,0,255.);
	}
}