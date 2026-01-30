precision highp float;void main()
{
	vec2 a=gl_FragCoord.xy/20.-.2;
	ivec2 b=ivec2(a);a-=vec2(b)+.5;
	
	if(b.x>2||b.y>2)
		discard;
	
	gl_FragColor=a.x<-.5||a.y<-.5||a.x>.3||a.y>.3?vec4(.5,.5,.5,1.):length(a+.1)<.4&&(b.x+b.y-3)*b.y==0?vec4(0.,0.,0.,1.):vec4(1.,1.,1.,1.);
}