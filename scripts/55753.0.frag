#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p=(gl_FragCoord.xy*2.0-resolution)/min(resolution.x,resolution.y);
	vec3 f = vec3(0.0);
	for(float i=0.0;i<5.0;++i)
	{
		float j=i+1.5;
		vec2 q = p + vec2(cos(time * j+1.5)/p.y, sin(time * i)/p);
		f+=0.05/length(q);
	}
	vec3 color;
	color.x=cos(time);
	color.y=sin(time);
	color.z=(color.x*color.y)/2.0;
	gl_FragColor = vec4( f.x*color.x+0.2,f.y*color.y+0.2,f.z*color.z+0.4, 1.0 );

}