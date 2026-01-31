#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 resolution;

vec4 yinyang(in vec2 fragCoord){
    vec2 p = 1.1 * (2.0*fragCoord-resolution.xy)/min(resolution.y,resolution.x);
	
	
	
	
	
	
	
	
	
    float h = dot(p,p);
    float d = abs(p.y)-h;
    float a = d-0.23;
    float b = h-1.00;
    float c = sign(a*b*(p.y+p.x + (p.y-p.x)*sign(d)));
    c = mix( c, 0.0, smoothstep(0.5,1.00,h) );
    c = mix( c, 0.6, smoothstep(1.00,1.02,h) );
    return vec4( c, c, c, 1.0 );
}
void main(void){
    vec2 p = gl_FragCoord.xy * 2.0;
    gl_FragColor = yinyang(gl_FragCoord.xy);
}

