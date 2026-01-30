

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

void main()
{
   
	vec2 p=(2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
    
    for(float i=1.;i<20.;i++)
    {
        p.x += .5/i*sin(i*p.y+time)+1.;
        p.y += .5/i*cos(i*p.x+time)+2.;
    } 
	
    p.y += cos(time/4.)*5.;
    p.x += sin(time/3.)*4.;
	
    
    p.x += mouse.x /3.;
    p.y -= mouse.y /3.;
    
     vec3 col=vec3(abs(sin(7.0*p.x))*1.3,  abs(sin(1.5*p.y))+0.3, abs(sin(2.0*p.x+p.y))+0.3);
    float dist = sqrt(col.x*col.x + col.y * col.y + col.z*col.z);
    gl_FragColor=vec4(col/dist, 1.0);
	
}
