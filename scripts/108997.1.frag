#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2. - 1.;

	float basis = length(sqrt(uv)-sin(abs(uv.x)));
	float christCross = abs(length(uv*1.2)-2.75);
	// Inigo Quilez's square
	vec2 d = abs(uv)-vec2(.07);
	float square = length( max(d,.0)) + min(max(d.x,d.y),.0);
	square = step(square,.0);

	gl_FragColor = vec4( vec3( basis*christCross)+vec3(vec2(square),.0), 1.0 );

}