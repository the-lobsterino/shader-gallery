// Created by Robert Schuetze - trirop/2017
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Original from https://www.shadertoy.com/view/MsScWD

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2  resolution;

vec2 v(vec2 p,float s){
	return vec2(sin(s*p.y),cos(s*p.x));	//advection vector field
}

vec2 RK4(vec2 p,float s, float h){
	vec2 k1 = v(p,s);
	vec2 k2 = v(p+0.5*h*k1,s);
	vec2 k3 = v(p+0.5*h*k2,s);
	vec2 k4 = v(p+h*k3,s);
	return h/3.*(0.5*k1+k2+k3+0.5*k4);
}

vec3 rainbow(float hue){
	return abs(mod(hue * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0;
}

void main( void )
{
	vec2 uv = 2.*gl_FragCoord.xy/resolution.y-vec2(resolution.x/resolution.y,1);
    	float s = 2.;
    	float h = log(1./(exp(8.*sin(time*0.5))+exp(-2.))+exp(-2.))/8.;  //=smooth_clamp(sin*4,-1,1)/4
    	for(int i = 0; i<5*8; i++){ //advect 5 times before rescaling
 		uv+=RK4(uv,s,h);
        if(mod(float(i),5.)==0.){   //rescale advection 8 times
        	s*=2.;
            	h/=2.;
        }
    }
	gl_FragColor = vec4(rainbow(floor(length(uv)*10.)/10.),1); //centered rainbow with 10 visible rings
}