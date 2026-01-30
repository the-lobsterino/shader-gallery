/*
 * Original shader from: https://www.shadertoy.com/view/wlcXWH
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// Quick Mandlebrot shader, by request. Hi Brad!
mat2 rot(float a)
{
	return mat2(cos(a),-sin(a),sin(a),cos(a));    
}

//Credit where due! Got this technique from davethomas426 here: https://www.shadertoy.com/view/4slcz8
vec2 complexmulti(vec2 x, vec2 y)
{
	return vec2(x.x * y.x - x.y * y.y, x.x * y.y + x.y * y.x);   
}

vec2 mandle(vec2 z, vec2 c)
{
	return complexmulti(z,z)+c;
}

float iterate(vec2 uv, float toff, float thresh)
{
    const int maxI = 256;
    float le = 0.0;
    vec2 c = uv;
    vec2 z = uv;
    float x = uv.x;
    for (int i = 0; i < maxI; i++)
    {
		z = mandle(z,c);
        le = length(z);
        if (le > thresh)
        {
            return (float (i)*((thresh * 0.02)+toff));
        }
    }
    return 0.7+toff;;
}

vec3 mandlayer(vec2 uv, float t)
{
	uv *= sin(t*0.1)*3.0;
    uv.x += sin(t*1.5) * 0.5;
    uv.y += cos(t*1.5 + 10.0) * 0.10;
    uv *= rot(t * 0.3);
    float off = (sin(t)*0.5+0.5)*0.1;
    float thresh = 2.0;
	return vec3(pow(iterate(uv,0.0,thresh),4.0),pow(iterate(uv,-off,thresh),4.0),pow(iterate(uv,+off,thresh),4.0));
     
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy)/iResolution.y;
	vec3 col = vec3(0.0);
    for (float i = 0.0; i < 1.0; i += 1.0/10.0)
    {
       col += mandlayer(uv * (i+1.0), iTime + i); 
    }
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}