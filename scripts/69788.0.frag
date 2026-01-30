/*
 * Original shader from: https://www.shadertoy.com/view/td33R7
 */
// https://www.youtube.com/watch?v=u3JePjNBRjM&feature=emb_logo

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
vec4 hex(vec2 uv, out vec2 id)
{
    uv *= mat2(1.1547,0.0,-0.5773503,1.0);
    vec2 f = fract(uv);
    float triid = 1.0;
	if((f.x+f.y) > 1.0)
    {
        f = 1.0 - f;
     	triid = -1.0;
    }
    vec2 co = step(f.yx,f) * step(1.0-f.x-f.y,max(f.x,f.y));
    id = floor(uv) + (triid < 0.0 ? 1.0 - co : co);
    co = (f - co) * triid * mat2(0.866026,0.0,0.5,1.0);    
    uv = abs(co);
    return vec4(0.5-max(uv.y,abs(dot(vec2(0.866026,0.5),uv))),length(co),co);
}

float hbar(vec2 p, float nline, float t)
{
    return 0.5+sin((p.y*nline)+t)*0.5;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float t = iTime;
	vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    //uv.x += t*0.1;
    
    vec2 id;
    vec4 h = hex(uv*8.0, id);

    float v = smoothstep(0.0,0.025,h.x);
    
    vec3 col1 = vec3(1.0,1.0,1.0);			// hex border colour
    vec3 col2 = vec3(0.2,0.35,0.2);			// hex internal colour
    
    float cm = 1.0 + pow(sin(length(id)*4.1 + t*0.65), 4.0);	// pulse mult
    cm *= 1.0 + (hbar(h.zw,100.0,t*12.0)*0.1);					// bars mult
    col2 *= cm;
    
    // Output to screen
    fragColor = vec4(mix(col1,col2,v*v),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}