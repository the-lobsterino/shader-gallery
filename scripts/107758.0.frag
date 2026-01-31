#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


bool func(vec2 fpos,vec2 pos1,vec2 pos2)
{
	return (fpos.x-pos1.x)*(pos2.y-pos1.y)>(pos2.x-pos1.x)*(fpos.y-pos1.y);
}
void main( void ) {

	vec2 fpos=gl_FragCoord.xy/resolution-0.5;
	bool b=false;
	float t=time*0.1;
	for(int i=0;i<32;i++)
	{
		float ii=float(i);
		vec2 pos1=vec2(cos(t*(ii*0.08+3.032)+3.745),sin(t*(ii*0.41+1.061)+1.267) )*0.25;
		vec2 pos2=vec2(sin(t*(ii*0.07+4.025)+2.45),cos(t*(ii*0.31+0.052)+2.234) )*0.25;
		if(func(fpos,pos1,pos2))
			b=!b;
	}
	float color=float(b);
	gl_FragColor = vec4( vec3( color), 1.0 );

}