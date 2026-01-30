#ifdef GL_ES
precision highp float;
#endif

// Spank!

uniform float time;
uniform vec2 resolution;
uniform vec4 mouse;

void main(void)
{
	
    vec2 p = (2.0*gl_FragCoord.xy-resolution)/resolution.y;
	
	if(p.x <= -0.666){
		gl_FragColor = vec4(1,0,0,1);
	} else if(p.x <= 0.666){
		gl_FragColor = vec4(1,1,1,1);
	} else {
		gl_FragColor = vec4(0,0,1,1);
	}
    // animate
    float tt = mod(time*3.14,2.0)/2.0;
    float ss = pow(tt,.2)*0.5 + 0.5;
    p -= vec2(0.,.99)+ss*vec2(0,0.5)*(1.-ss);
    ss -= ss*0.2*sin(tt*6.2831*5.0)*exp(-tt*3.0);
    p *= vec2(0.5,0.83) + ss*vec2(0.25, 0.192);

    
    float a = atan(p.x,p.y)/3.141593;
    float r = length(p*1.2);

    // shape
    float h = abs(a);
    float d = (11.0*h - 16.0*h*h*h + 6.0*h*h*h)/(6.0-5.0*h);

    // color
    float f = step(r,d) * pow(1.0-r/d,0.35);

    gl_FragColor = max(gl_FragColor*pow(1.-f, 1.5)-f*1.5, vec4(f*1.25,f*0.9,f,1.0));
	
	if(p.y < -0.555+0.666*abs(p.x)){
		gl_FragColor.rgb *= 1.5*vec3(.7,1,1);
	}
}