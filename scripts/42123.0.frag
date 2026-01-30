#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec4 mouse;

float hitcheck(vec2 p, float time){
    
    // animate
    float tt = mod(time,2.0)/2.0;
    float ss = pow(tt,.2)*0.5 + 0.5;
    ss -= ss*0.2*sin(tt*6.2831*5.0-.33*p.x)*exp(-tt*6.0+p.y);
    p *= vec2(0.5,1.5) + ss*vec2(0.5,-0.5);

    
    float a = atan(p.x,p.y)/3.141593;
    float r = length(p);

    // shape
    float h = abs(a);
    float d = (13.0*h - 22.0*h*h + 10.0*h*h*h)/(6.0-5.0*h);

    // color
    return step(r,d) * pow(1.0-pow(r/d, 8.),1./4.);
	
}
void main(void){
	vec2 p = (2.0*gl_FragCoord.xy-resolution)/resolution.y;
	p.y -= 0.25;
	gl_FragColor = vec4(1.);
	gl_FragColor.gb *= hitcheck(p, time);
	p += vec2(cos(time), sin(time))*0.01;
	gl_FragColor.r = hitcheck(p, time);
}
