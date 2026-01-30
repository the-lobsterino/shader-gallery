// https://www.shadertoy.com/view/dsXXzH

#extension GL_OES_standard_derivatives : enable

precision highp float;
uniform float time;
uniform vec2 resolution;

// https://www.shadertoy.com/view/dsXXzH

void main()
{
    float t = fract(time*0.1)*6.28;
    vec2 p = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
	p.xy *= 0.75+(sin(time*0.54)*0.5);
	
	p*=length(p)-1.75;
	float bv = sin(p.y*3.0);
	p.x *= dot(p,p);
	
    p.y *= 2.25;
  	p.y = 2.0 * sin(p.y*16.0+p.x * 7.0 )+ 0.5 * sin(p.x * 11.0 + t*2.0 );
	
    p.y = pow(abs(p.y*1.3+p.x*0.8),0.75);
    float v = clamp(p.y , 0.0, 1.8)*(abs(bv));
    gl_FragColor = vec4(v*.48,v*0.45,v*0.89,1.0);
}



