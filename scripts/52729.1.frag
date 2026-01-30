#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI  = 3.14;
const float PI2 = PI* 2.;


// see https://qiita.com/7CIT/items/114748d5f90077368920

// 矩形波
float sqr(float x){
    return -2.*(step(.5,fract(x*.5))-.5);
}

// のこぎり波
float saw(float x){
    return fract(-x*.5)*2.-1.;
}

// 三角波
float tri(float x){
    return abs(2.*fract(x*.5-.25)-1.)*2.-1.;
}


float func(in float x)
{
	// #遊んでくださいshader
	// 適当な関数を入れてください。
	//return sqr(x*5.+time)*.5;
	return tri(x+time);
	return saw(x+time);
	return 0.5*sin(5.0*x+time + 0.3* sin((x)*20.0));
	return (x-sin(time))*(2.0*x-sin(time*0.5))*x;
    	return sin( x * 3.14159 * 0.5 +time)*.5;
}

float map(in vec2 p)
{
	p.y -= func(p.x);
	// ゆがむ事の補正。微分を使ってます。
    	float e = 0.001;
    	float g = (func(p.x+e)-func(p.x-e))/(2.0*e);
    	p.y *= cos(atan(g));
    	return p.y;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;
	// smoothstepを使ってアンチエイリアス
	vec3 col = mix(vec3(1), vec3(0), smoothstep(0.0, 0.03, abs(map(uv)))); 
	gl_FragColor = vec4( col, 1.0 );

}