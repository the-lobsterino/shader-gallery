#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define _PI 3.1415
#define _PI2 1.57
#define _2PI 6.283
void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	//pos = pos - vec2(.5);
	//pos*=resolution;
	
	vec2 uv = pos;
 
    if(mouse.x<=.1 && mouse.y<=.1)
    {
     	gl_FragColor = vec4(.0);//vec4(.3,.6,.1,.5);
        return;
    }
	
   vec2 it = 2./resolution;
    uv = gl_FragCoord.xy/resolution;
    vec2 puv = uv;
	
    vec4 pcol = vec4(1.);
	
	if(uv.x == .0 && uv.y == .0)
	{
		gl_FragColor = vec4(.4,.3,.1,.5);
		return;
	}else
	{
		gl_FragColor = vec4(.4,1.3,.1,.5);
		return;
	}
	return;
	
    if(uv.x != .0 && uv.y != .0)
    {
	if(uv.x<=0.)
          puv = vec2(1.,puv.y - it.y);
	else
          puv.x = puv.x - it.x;
	pcol = texture2D(backbuffer,puv)*10.;
    }
    
    if(pcol.a>0.)
    {
        pcol += vec4(.01,1.0,.01,.1);
        /*
    	float nx,x = pcol.x;
		float ny,y = pcol.y;
		
		float var_x = iMouse.x*0.1;
		float var_y = iMouse.y*0.1;
		//var_y = var_x = mouse.x;
		float A=-20.+40.;//*var_x;
		float B=-3.+9.*var_x;
		float C = -5.+10.;//*var_y;
		float D = -3.+6.*var_y;
		vec3 color = vec3(.0);
		float sc = 1.;
		for(int i=1;i<2;++i)
		{
			nx=sin(A*y)-cos(B*x); 
			ny=sin(C*x)-cos(D*y);
			// v=sqrt((x-nx)^2+(y-ny)^2)*atan2(ny,nx)*ip;
		    float v = sqrt(pow((x-nx),2.)+pow((y-ny),2.))*atan(ny,nx)*IP;
    	  	color.r=(color.r+abs(sin(v*_PI*3.2-_PI*.2)))*.5;
		    color.g=(color.g+abs(sin(v*_PI*12.3+_PI*1.5)*.5+.5))*.5;
    	  	color.b=(color.b+(sin(v*_PI*3.84+_PI2-.6)*.5+.5))*.5;
		    x=nx;
			y=ny;
			//nx=nx*sc+512.; 
			//ny=ny*sc+512.;
		}
		*/
	    gl_FragColor = vec4(1.,.0,.12,.1);
	    return;
    }
    else
    {
        pcol = vec4(.0);
    }
    gl_FragColor = pcol;
}