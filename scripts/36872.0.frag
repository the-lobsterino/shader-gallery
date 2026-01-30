#ifdef GL_ES
precision mediump float;
#endif


//MODS BY NRLABS 2016


#extension GL_OES_standard_derivatives : enable



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 flag ( vec2 u ) {
    vec3 c = vec3(1);
    if (fract(u.y*21.25)>.5) {
    	c = vec3(1,0,0);    
    }
    if (u.x<.35&&u.y>.65) {
       
    	c = vec3(0, 0, 1);    
    }
	return c;    
}

void main()
{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv-=.5;
    uv*=2.;
    uv+=.5;
    vec3 col = vec3(0.1, .4, 1.);
    if (uv.y<cos(uv.x*3.)/3.) col = vec3(0,.3,0);
    
    {
	    float sv = sin(time*5.-uv.x*20.+uv.y*5.);
        vec2 u = uv+vec2(0, sv/20.*(uv.x-.2));
        if (u.x>.2&&u.x<.5) {
            if (u.y<.8&&u.y>.5) {
                col = flag(u)*(1.8-max(.9, sv/4.+.8));
            }    
        }
       	if (abs(u.x-.2)<.002&&uv.y<.8)
          	col = vec3(min(.7/(abs(u.x-.2)*700.), .8));
    }
    
    if (uv.y<cos(uv.x*10.)/10.) col = vec3(0,.6,0);
    if (uv.y<sin(uv.x*5.)/10.) col = vec3(0,1,0);
    
    col*=1.27-length(uv-.5);
    //if (length(uv-.9)<.051) col = vec3(1,1,0)/(length(uv-.9)*10.);
    
	gl_FragColor = vec4(col,1.0);
}
