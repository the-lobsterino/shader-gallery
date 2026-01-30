precision mediump float;

uniform float time;
uniform vec2 resolution;



// flag of Luxembourg
vec3 lux(vec2 _uv)
{
    if (mod(_uv.y, 1.0) < 0.3333)
    {
        return vec3(0.0,0.6,.4); //blue
    } 
    else
if (mod(_uv.y, 1.0) < 0.6666)
    {
        return vec3(1.0,1.0-_uv.x*0.1,1.0); //white
    }
    else
    {
        return vec3(.4,0.0,_uv.x*0.3); //red
    }
}


void main( )
{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    uv.y += sin(time+uv.x*sin(uv.x*6.0+time)*uv.y*sin(time)*10.0)*0.5;
	
    uv.y += sin(time*0.1+uv.x*5.0)*0.2;
    uv.x += sin(time*0.1+uv.y*5.0)*0.2;
	
    gl_FragColor = vec4(lux(uv),1.0)*mod(time+uv.y,1.0)*0.8; 
}