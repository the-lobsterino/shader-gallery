#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d+time*0.5) );
}


vec3 drawWave(float speed, float range, float height,float offset, float power, vec2 uv, float dis){
 	vec3 finb = mix(vec3(0.096,0.888,0.888),vec3(0.113,0.713,0.886),dis);
    float siny = offset + height*pow(sin(uv.x * range + time * speed)+2.0,power);
    if(uv.y>siny)
        finb = vec3(1.0,1.0,1.0);
    return finb;
}

void main()
{
    float aspect = resolution.x/resolution.y;
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float dis = distance(uv.xy,vec2(0.5,0.5));
    vec3 col = pal( uv.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67) );	
    vec4 fin = vec4( mix( col.rgb, mix( vec3(0.0,0.0,0.0), vec3(1.0,1.0,1.0), uv.y ), 1.0 - sin( pow( uv.y, 1.5 ) * 3.141592+time*1. ) ), 1.0 );
   
	//              speed, range, height,offset,power,uv dis  
 	for(float i=0.6;i<4.0;i+=0.2){
		
	fin.rgb *= drawWave(0.6*(i*8.),   60.0,  0.008,0.5, 1.9, uv+(i/8.0),dis);
	// much better than repeat ligne ; gigatron	
 	}
   
    gl_FragColor = fin;
	 
}