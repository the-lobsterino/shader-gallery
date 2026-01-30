#ifdef GL_ES
precision mediump float;
#endif

// burl figure

uniform float time;

const float Pi = 3.14159;

void main()
{

    
    float time2 = time*20.;
    float R = 0.374;
    float G = 0.464;
    float B = -0.142;
    vec2 p=.005*gl_FragCoord.xy;
    for(int i=1;i<4;i++)
    {
        vec2 newp=p;
        newp.x+=(1.1/float(i)*sin(float(i)*p.y+(time2*3.0/10.)/20.0+0.3*float(i))+4.);
        newp.y+=(1.5/float(i)*cos(float(i)*p.x+(time2*2.0/10.)/20.0+0.3*float(i*10))-4.0);
        p=newp;
    }
    //vec3 col=vec3(1.0-(R*sin(1.0*p.x)+0.5),1.0-(G*sin(1.0*p.x)+0.0),1.0-(B*sin(p.y)+0.15));
    
    //vec3 col=vec3((R*sin(1.0*p.x)+0.5),(G*sin(1.0*p.x)+0.0),(B*sin(p.y)+0.15));
    vec3 col=vec3((R*sin(1.0*p.x)+0.45),(G*sin(1.0*p.x)+0.),(B*sin(p.y)-0.05));
    
    //gl_FragColor=vec4(col/1.6, 1.0);
    gl_FragColor=vec4(col/1., 1.0);

}
