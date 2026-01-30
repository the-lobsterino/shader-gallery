#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

lowp vec4 vStartColor = vec4(1.0, 0.0, 0.0, 1.0);
lowp vec4 vIntermediateColor = vec4(0.0, 1.0, 0.0, 1.0);
lowp vec4 vEndColor = vec4(1.0, 0.0, 0.0, 1.0);

void main()
{
	lowp float percent = fract(time);
	
	if (percent<0.5)
	{
		percent*=2.0;
		gl_FragColor = (1.0-percent) * vStartColor + percent * vIntermediateColor;
	}
	else
	{
		percent=(1.0-percent)*2.0;
		gl_FragColor = percent*vIntermediateColor + (1.0-percent) * vEndColor;
	}
}