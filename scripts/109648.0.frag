#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec4 lcol=vec4(0.3,0.2,0.1,1.0);
vec4 bcol=vec4(0.7,0.11,0.8,1.0);
vec2 gap=vec2(25.0,25.0);

uniform sampler2D sTex;

void main( void ) {
	vec2 res=mod(gl_FragCoord.xy,gap);
	if(res.x<1.0 || res.y<1.0)
	{
		gl_FragColor=lcol;
	}
	else
	{
		gl_FragColor=bcol;
	}

	vec4 sum=texture2D(sTex,gl_FragCoord.xy/resolution);
	

}