#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D  bb;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec3 color = vec3(float(gl_FragCoord.x<2.0),float(gl_FragCoord.x<2.0),float(gl_FragCoord.x<2.0));
	
	if (gl_FragCoord.y<1.0)
	{
		gl_FragColor.rgb = texture2D(bb,position).rgb+cross(texture2D(bb,position-vec2(1.0/resolution.x,0.0)).rgb,vec3(1.0,1./255.,1./(255.0*255.0)))*255.;
	}
	else
	{
		gl_FragColor = vec4( color, 1.0 );
	}

}