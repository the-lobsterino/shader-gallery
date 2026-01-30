#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI  = 3.141592653589793;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float atan2(in float y, in float x){
    return x == 0.0 ? sign(y)*PI/2.0 : atan(y, x);
}


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	/*float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;*/
	
	/*vec4 color = vec4(0.0);
	vec3 dx = vec3(0.0);
	vec3 dy = vec3(0.0);
	float amount = 0.0;
	amount = clamp(0.5-(mod(time,2.0)-0.5)*5.0,0.0,5.0);
	
	dx.r = rand(vec2(0.0,time)) * amount * 2.0 - amount;
	dx.g = rand(vec2(1.0,time)) * amount * 2.0 - amount;
	dx.b = rand(vec2(2.0,time)) * amount * 2.0 - amount;
	dy.r = rand(vec2(3.0,time)) * amount * 2.0 - amount;
	dy.g = rand(vec2(4.0,time)) * amount * 2.0 - amount;
	dy.b = rand(vec2(5.0,time)) * amount * 2.0 - amount;
	
	if (mod(gl_FragCoord.x+dx.r,40.0) >= 20.0)
	{
		color.r = 1.0;
		
	}
	if (mod(gl_FragCoord.y+dy.r,40.0) >= 20.0)
	{
		color.r = color.r == 1.0 ? 0.0 : 1.0;
	}
	
	if (mod(gl_FragCoord.x+dx.g,40.0) >= 20.0)
	{
		color.g = 1.0;
		
	}
	if (mod(gl_FragCoord.y+dy.g,40.0) >= 20.0)
	{
		color.g = color.g == 1.0 ? 0.0 : 1.0;
	}
	
	if (mod(gl_FragCoord.x+dx.b,40.0) >= 20.0)
	{
		color.b = 1.0;
		
	}
	if (mod(gl_FragCoord.y+dy.b,40.0) >= 20.0)
	{
		color.b = color.b == 1.0 ? 0.0 : 1.0;
	}
	
	color.a = 1.0;*/
	
	vec4 color = vec4(1.0);
	float alpha = 0.0;
	float dan = atan2(position.x-0.5,position.y-0.5);
	
	alpha = dan;
	

	gl_FragColor = color * alpha;

}