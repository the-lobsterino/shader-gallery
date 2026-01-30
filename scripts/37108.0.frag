#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {
	// Initialazation
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 vColor = vec3(0.0, 0.0, 0.0);
	
	// Colorshift
	vColor.x = abs(sin(time)) * position.x;
	vColor.y = abs(cos(time)) * position.x;
	vColor.z = clamp((position.x * position.y), 0.0, 1.0);
	
	// Scanlines
	vColor.xyz *= abs(sin((position.y * 150.0) + (time * 4.0)));
	
	// Vingette
	vec2 tex;
	tex.x=pow((position.x-0.5)*2.0,4.0);
	tex.y=pow((position.y-0.5)*2.0,4.0);
	float dist=1.0-distance(vec2(0.0,0.0),tex);
	dist=smoothstep(0.0,0.5,dist);
	dist*=1.0-distance(vec2(0.5,0.5),position);
	vColor.xyz*=vec3(dist); 

	gl_FragColor = vec4(vColor, 1.0 );

}