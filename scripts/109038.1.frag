#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
        float color = mod(uv.x,.2)+1.-mod(uv.y+sin(uv.x*7.),.2)*sin(uv.y*80.)+tan(exp(uv.y-1.)*1.2);
	gl_FragColor = vec4( vec3( color*.3,color*.2,color*.1), 1.0 );

}