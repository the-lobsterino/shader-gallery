#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
// unfinished by gigatron ; road sin code from shader toyyy from mr matz;
vec3 road(vec3 pos)
{
	vec3 c1 = vec3(0.8,0.9,0.9);
	vec3 c2 = vec3(0.4,0.4,0.8);
	 
	float a=time;
	
	if(abs(pos.x) < 1.8)
	{
		//c1 = vec3(0.9,0.0,0.1);
		//c2 = vec3(0.9,0.0,8.0);
		
		
	}
	
	for(float i=0.0;i<10.0;i+=.5){
	if(abs(pos.x) > i  && (abs(pos.x) < i+0.2))    //left and right line
	{
		c1 = vec3(0.5,0.5,0.5);
		c2 = vec3(0.8,0.8,0.8);
	}
	
	
	float v = pow(sin(0.),20.0);
	
	float rep = fract(pos.y+time*2.0);
	float blur =  dot(pos,pos)*0.019;
	vec3 ground = mix(c1,c2,smoothstep(0.25-blur*0.25,0.25+blur*0.25,rep)*smoothstep(0.75+blur*0.25,0.75-blur*0.25,rep));
	
	return ground;
}

vec3 sky(vec2 uv)
{
	return mix(vec3(1.0,1.0,1.0),vec3(0.1,0.7,1.0),uv.y);
}




void main( void ) 
{
	vec2 res = resolution.xy/resolution.y;
	vec2 uv = gl_FragCoord.xy / resolution.y;
	uv -= res/2.0;
	

	vec3 pos = vec3(uv.x/abs(uv.y),1.0/abs(uv.y),step(0.0,uv.y)*2.0-1.0);
	
	vec3 color = vec3(0.0);
	
	color = mix(road(pos),sky(uv),step(.0,pos.z));
	
	
	
	gl_FragColor = vec4(color, 1.0 );

}