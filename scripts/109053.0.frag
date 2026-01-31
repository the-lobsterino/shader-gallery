#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) -1.;
        uv.y-=fract(time*.1);
	float pattern = sin(abs(uv.x-uv.y*sin(uv.y+uv.x)*4.+20.)*30.);
	vec3 firstCol = vec3(1.-uv.y*2.,1,0);
	vec3 color = mix(firstCol,vec3(0,0,1),pattern);

	gl_FragColor = vec4(color, 1.0 );

}