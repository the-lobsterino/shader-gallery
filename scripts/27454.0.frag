#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float box(vec2 pos, vec2 size){
    vec2 q = abs(pos);
    return length(max(q - size, 0.0));
}

float sphere(vec2 pos, float radius){
    return length(pos) - radius;
}

float OutBounce(float t,float totaltime,float max ,float min )
{
    max -= min;
    t /= totaltime;

    if( t < 1.0/2.75 )
	return max*(7.5625*t*t)+min;
    else if(t < 2.0/2.75 )
    {
	t-= 1.5/2.75;
	return max*(7.5625*t*t+0.75)+min;
    }  
    else if( t< 2.5/2.75 )
    {
	t -= 2.25/2.75;
	return max*(7.5625*t*t+0.9375)+min;
    }
    else
    {
	t-= 2.625/2.75;
	return max*(7.5625*t*t+0.984375) + min;
    }
}

float InBounce(float t, float totaltime, float max ,float min)
{
    return max - OutBounce( totaltime - t , totaltime , max - min , 0.0 ) + min;  
}

float InOutBounce(float t, float totaltime, float max ,float min)
{
    if( t < totaltime/2.0 )
	return InBounce( t*2.0, totaltime, max-min, max)*0.5 + min;
    else
	return OutBounce(t*2.0-totaltime, totaltime, max-min, 0.0)*0.5+min + (max-min)*0.5;
}

vec4 style1(vec2 pos){
        float rt = 0.3333333333;
	float hrt = 0.3333333333 / 2.0;
		
	float blackbox = box(vec2(0.5, 0.5) - pos, vec2(hrt, 0.5));
	float redcircle = sphere(vec2(1.0-hrt, 1.0-hrt) - pos, hrt);
	
	float goldtri = box(vec2(hrt, 1.0-hrt) - pos, vec2(hrt, hrt));
	float silvertri = box(vec2(1.0-hrt, hrt) - pos, vec2(hrt, hrt));
	float whitecircle = -sphere(vec2(0.5, 0.5) - pos, 0.525);
	
	vec4 ret1 = max(goldtri,whitecircle) > 0.0 ? vec4(1, 1, 1, 1) :  vec4(1, 1, 0, 1);
	vec4 ret2 = max(silvertri,whitecircle) > 0.0 ? ret1 :  vec4(0.5, 0.5, 0.5, 1);
	vec4 ret3 = blackbox > 0.0 ? ret2 : vec4(0.0, 0.0, 0.0, 1);

	return redcircle > 0.0 ? ret3 : vec4(1, 0, 0, 1);	
}

vec4 style2(vec2 pos){
        float rt = 0.3333333333;
	float hrt = 0.3333333333 / 2.0;
	
	float blackbox = box(vec2(0.5, 0.5) - pos, vec2(hrt, 0.5));
	float redcircle = 1.0;
	
	float goldtri = box(vec2(hrt, 1.0-hrt) - pos, vec2(hrt, hrt));
	float silvertri = box(vec2(1.0-hrt, hrt) - pos, vec2(hrt, hrt));
	float whitecircle = -sphere(vec2(0.5, 0.5) - pos, 0.545);
	float blackcircle = -sphere(vec2(0.5, 0.5) - pos, 0.8);
	
	vec4 ret1 = max(goldtri,whitecircle) > 0.0 ? vec4(0, 0, 0, 1) :  vec4(1, 1, 1, 1);
	vec4 ret2 = max(silvertri,whitecircle) > 0.0 ? ret1 :  vec4(1, 1, 1, 1);
	vec4 ret3 = blackbox > 0.0 ? ret2 : vec4(1, 1, 1, 1);
	vec4 ret4 = blackcircle > 0.0 ? ret3 : vec4(1, 1, 1, 1);
	return redcircle > 0.0 ? ret4 : vec4(1, 0, 0, 1);	
}

void main( void ) {
	vec2 pos = ( gl_FragCoord.xy / resolution.yy) * 2.0 - vec2(0.5, 0.5);
	float tm = sin(time)*0.5+0.5;
	if(tm > 0.1 && tm < 0.9)
	pos.x += sin(time*100.0)*0.05*OutBounce(tm, 1.0, 0.0, 1.0);
	gl_FragColor = mix(style1(pos), style2(pos), OutBounce(tm, 1.0, 0.0, 1.0));
}