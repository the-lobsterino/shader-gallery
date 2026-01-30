#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float startRandom;

highp float rand(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

highp float rand(float init)
{
    return rand(vec2(init, init));
}

highp float rand()
{
    return rand(time);
}

void main( void )
{
	vec2 pos = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.x;
	float zoom = 1000.0;
	pos *= zoom;
	vec4 bgColor = vec4(0);
	vec4 curveColor = vec4(1, 0, 0, 0);
	float width = 0.25;
	
	vec4 color = bgColor;
	float xvalue = sin(pos.y/50.0+rand(pos.y)*2.0+time/20.0)*100.0;
	color += curveColor*width / length(pos.x + xvalue);
	
	gl_FragColor = vec4(color);
}