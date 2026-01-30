#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;

void main()
{
	vec2 p = 2.0*gl_FragCoord.xy/256.0;
	for (int n=1; n<10; n++) {
		float i = float(n);
		p += floor(vec2(
			// whole lotta garbage
			0.7/i*sin(i*p.y+time+0.3*i)+2.2,
			0.4/i*sin(i*p.x+time+0.3*i)+4.6
			)*3.0)/2.0+sin((p.x-time)/4.9);
		}
	gl_FragColor = vec4(0.5*sin(p.x)+0.5,0.5*sin(p.y)+0.5,0.5+sin(p.x+p.y),1.0);
}
