#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	for (int i=0; i<=4; i++){
        uv *= fract(uv*4.);
	vec2 d = abs(uv-.5)-vec2(.49);
	float s = length(max(d,.0)) + min(max(d.x,d.y),.0);
	s = step(s,.0);
	
	gl_FragColor = vec4(vec3(1.,s,.0),1.);
         
	}

}