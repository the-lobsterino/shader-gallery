

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform vec2 texCoord0;
 
void main()
{
	//圆的颜色
	vec4 colorCircle = vec4(1.0, 0., 0., 1.);
	//背景色
	vec4 colorBg = vec4(0., 0., 0., 1.);
	//圆心
	vec2 center = vec2(0.5, 0.5);
	//半径
	float radio = 0.5;
	
	//任意点掉圆心的距离
	float d = distance(texCoord0, center);
	if (d < radio)
	{
	    gl_FragColor = colorCircle;
	}
	else
	{
	    gl_FragColor = colorBg;
	}  
}