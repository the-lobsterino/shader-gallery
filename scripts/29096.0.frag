#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 drawWave(float speed, float range, float height,float offset, float power, vec2 uv, float dis){
 	vec3 finb = mix(vec3(0.796,0.796,0.745),vec3(0.513,0.513,0.486),dis);
    float siny = offset + height*pow(sin(uv.x * range + time * speed)+1.0,power);
    if(uv.y>siny)
        finb = vec3(1.0,1.0,1.0);
    return finb;
}

void main()
{
    float aspect = resolution.x/resolution.y;
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float dis = distance(uv.xy,vec2(0.5,0.5));
    vec4 fin = mix(vec4(0.91,0.91,0.87,1),vec4(0.65,0.65,0.517,1),dis);
   
	//              speed, range, height,offset,power,uv dis  
    fin.rgb *= drawWave(0.4,   70.0,  0.007,  0.5,   1.9, uv,dis);
    fin.rgb *= drawWave(0.8,60.0,0.01,0.5,1.9,uv,dis);
    
   
    gl_FragColor = fin;
	 
}