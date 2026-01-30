#ifdef GL_ES
precision mediump float;
#endif


#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
	vec4 o  = vec4(3.);
	
    	o = 20. * vec4((gl_FragCoord.xy*2.-(o.xy=resolution.xy))/o.y, pow((1.-cos(time*.15)),2.)*20. /* pow(mod(time*2.,60.)*.1,3.) */ ,0); 
    	for(int i = 0; i < 44; i++)               
            o.wxzy = abs( o / dot(o,o) - vec4(.8,.412,.005,.4) );
	gl_FragColor = o;
}