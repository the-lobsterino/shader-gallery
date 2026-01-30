#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 Circle(vec2 uv, vec2 p, float r, float blur, vec4 color)
{    
    float d = length(uv-p);
    float c = smoothstep(r, r-blur, d);    
    return c * color;
}

vec4 smiley(vec2 uv, vec2 p, float size, float blur)
{
	vec4 c = vec4(0.);
    
    c += Circle(uv, size * vec2( .00,  .00) + p, size * .40, blur, vec4(1., 2.0, 0.5,  1.));    c  = clamp(c, 0., 1.);
    
    c -= Circle(uv, size * vec2( .00, -.10) + p, size * .18, blur, vec4(1., 1., 0.,  1.));    c  = clamp(c, 0., 1.);
    c += Circle(uv, size * vec2( .00,  .01) + p, size * .23, blur, vec4(1., 1., 0.,  1.));    c  = clamp(c, 0., 1.);    
    
    
    c -= Circle(uv, size * vec2( .00, -.05) + p, size * .07, blur, vec4(0., 1., 0.,  1.));    c  = clamp(c, 0., 1.);
    
    c -= Circle(uv, size * vec2(-.15,  .10) + p, size * .10, blur, vec4(1., 1., 1.,  1.));    c  = clamp(c, 0., 1.);
    c -= Circle(uv, size * vec2( .15,  .10) + p, size * .10, blur, vec4(1., 1., 1.,  1.));    c  = clamp(c, 0., 1.);
    
    c += Circle(uv, size * vec2(-.15,  .10) + p, size * .08, blur, vec4(1., 1., 1.,  1.));    c  = clamp(c, 0., 1.);
    c += Circle(uv, size * vec2( .15,  .10) + p, size * .08, blur, vec4(1., 1., 1.,  1.));    c  = clamp(c, 0., 1.);
    
    c -= Circle(uv, size * vec2(-.15,  .10) + p, size * .06, blur, vec4(0., 1., 1.,  1.));    c  = clamp(c, 0., 1.);
    c -= Circle(uv, size * vec2( .15,  .10) + p, size * .06, blur, vec4(0., 1., 1.,  1.));    c  = clamp(c, 0., 1.);
    
    c -= Circle(uv, size * vec2(-.15,  .10) + p, size * .05, blur, vec4(1., 0., 0.,  1.));    c  = clamp(c, 0., 1.);
    c -= Circle(uv, size * vec2( .15,  .10) + p, size * .05, blur, vec4(1., 0., 0.,  1.));    c  = clamp(c, 0., 1.);
    
    return c;
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));}

void main()
{
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy)/resolution.y;
	
    vec2 uv2 = (gl_FragCoord.xy - 0.5 * resolution.xy)/resolution.y;
     
    mat2 rot = mat2(cos(time),-sin(time),sin(time),cos(time));
    uv *= rot;
    
    uv = fract(uv*8.0*sin(time))-0.5;
    uv2 *= rot;
   // 	
	 
    
    vec4 c = smiley(uv, vec2(0.0,  0.00), 1.00, .015);
	
	 c += smiley(uv2, vec2(0.0,  0.00), 1.00, .015);
	
	
        
    gl_FragColor = c;
}