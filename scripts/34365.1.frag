#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;

	vec3 color = vec3(0);
	if(length(position)<= 1.0){	
		vec2 fdir = normalize(position);
		float mixer = length(position);
		color = normalize(mix(vec3(0,1,0), vec3(fdir.x, 0.0, fdir.y), mixer));
	}

	gl_FragColor = vec4( color * 0.5 + 0.5, 1.0 );

}