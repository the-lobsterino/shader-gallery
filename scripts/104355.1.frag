#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// V-Drop (rotate remix) - https://www.shadertoy.com/view/tdGXWm
#define PI 3.14159
#define	TAU 6.28318

mat2 rot(float a)
{
    float s=sin(a),c=cos(a);
    return mat2(c,s,-s,c);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	
	vec2 uv = (fragCoord.xy - .5 * iResolution.xy) / iResolution.y;
	float dd1 = length(uv);
	dd1 = smoothstep(0.0,0.5,dd1);
	uv.xy /= dot(uv,uv)*1.25;
	
	float dd = length(uv*.25);
    uv *= rot(dd+fract(iTime*0.025)*TAU);
    vec3 col = vec3(1.05,.85,1.825)*1.0;	     	// Drop Colour
    uv.x = uv.x*32.0;						// H-Count
    float dx = fract(uv.x);
    uv.x = floor(uv.x);
    float t =  iTime*0.4;
    uv.y *= 0.15;							// stretch
    float o=sin(uv.x*215.4);				// offset
    float s=cos(uv.x*33.1)*.3 +.7;			// speed
    float trail = mix(95.0,35.0,s);			// trail length
    float yv = fract(uv.y + t*s + o) * trail;
    yv = 1.0/yv;
    yv = smoothstep(0.0,1.0,yv*yv);
    yv = sin(yv*PI)*(s*5.0);
    float d2 = sin(dx*PI);
    yv *= d2*d2;
    col = col*yv;
    
    	
	col *= dd1;
    fragColor = vec4(col,1.0);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}//