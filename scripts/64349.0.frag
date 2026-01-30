#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	position -=.5;
	float x = 0.0;
	float y = 0.0;
	float z = 0.0;
	float l = length(vec2(position.x,position.y));
	x = smoothstep(0.1, 0.2, l);
	y = smoothstep(0.2, 0.1, l);
	
	
	
	float color = y;
	
	if(color == 0.)
	{
	  gl_FragColor = vec4(vec3(1,0,0), 1.0);
	}
	
	if(color > 0.)
	{
	  gl_FragColor = vec4(vec3(color), 1.0);
	}
	
	if(color < 0.)
	{
	  gl_FragColor = vec4(vec3(1,1,0), 1.0);
	}

}