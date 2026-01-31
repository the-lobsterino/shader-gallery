#ifdef GL_ES
precision mediump float;
#endif

//#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
float saturate(float x){return clamp(x,0.,5.);}
vec4 tex(vec2 u){
	vec2 p=fract(fract(u)+(sin(u.y+time)/400.));
	float f=1.-saturate((max(length(p-vec2(0.25,0.5)),length(p-vec2(.75,0.5)))-.5)*50.);
	f-=1.-saturate((length(p-.5)-(((sin(time+u.x)+2.)/3.)*.25))*25.);
	return vec4(f,f,f,0.);
}

vec4 tex2( vec2 g )
{
    g /= 10.;
    float color = sign((mod(g.x, 2.2) - 0.05) * (mod(g.y, 0.1) - 0.05));
    
    return sqrt(vec4(color));
}

void main()
{
    vec2 uv = surfacePosition * 1.;
    
    float t = time * 3.0;
    uv.y += sin(t) * .0;
    uv.x += cos(t) * .0;
    float a = atan(uv.x,uv.y)/2.57;
    float d = max(max(abs(uv.x),abs(uv.y)), min(abs(uv.x)+uv.y, length(uv)));
   
    vec2 k = vec2(a,.7/d + t);
    
    vec4 tx = tex(k*5.);
    vec4 tx2 = tex2(k*6.);
    
    // ground
    gl_FragColor = tx2;
    
    // wall
    if (d<=abs(uv.x)+0.0||d<=abs(uv.x)+uv.y)
        gl_FragColor = tx;
    
    gl_FragColor *= d;
	gl_FragColor.a = 10.;
	
}