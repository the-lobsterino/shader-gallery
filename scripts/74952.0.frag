#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float Function(float x,float y)
{
    float iTime = time ;
    x = x * 8.;
    x -= iTime * 1.0;
    //return sin(x * sin(iTime * .2)) * sin(x + cos(iTime * iTime * .01)) * .25 + .5;
    // return tan(x) / 2.0 + 0.5;
    return 0.5+(mod(x ,1.0))/2.0 - 0.25-y;
    // return tan(x)/2.0 - y + 0.5;
    // return (x/1500.0)+0.5;
    // return sin(x)/3.0 - y + 0.5;
}



void main( void ) {

    vec2 iResolution = resolution;
    vec2 uv = gl_FragCoord.xy / iResolution.y;
    
	
  
	vec2 q = uv;
	float vv = Function(q.x, q.y);
	    
	if (abs(vv) <= 0.005){
		gl_FragColor = vec4(1.0,0.0,0.0,1.0);
	} else if (vv >= 0.0) {
		gl_FragColor = vec4(1.0,1.0,0.0,0.25);
	}

    

}