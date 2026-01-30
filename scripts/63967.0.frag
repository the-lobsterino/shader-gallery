/*
 * Original shader from: https://www.shadertoy.com/view/MdKyzw
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
vec2 rand2(in vec2 p)
{
	return fract(vec2(sin(p.x * 591.32 + p.y * 154.077), cos(p.x * 391.32 + p.y * 49.077)));
}

float voronoi(in vec2 x)
{
	vec2 p = floor(x);
	vec2 f = fract(x);
	float minDistance = 1.;
    
	for(int j = -1; j <= 1; j ++)
	{
		for(int i = -1; i <= 1; i ++)
		{
			vec2 b = vec2(i, j);
            vec2 rand = .5 + .5 * sin(iTime * 3. + 12. * rand2(p + b));
			vec2 r = vec2(b) - f + rand;
			minDistance = min(minDistance, length(r));
		}
	}
	return minDistance;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
        
	vec2 uv = fragCoord / iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;
    float val = pow(voronoi(uv * 8.) * 1.25, 7.) * 2.;
    float gridLineThickness = 2. / iResolution.y;
    vec2 grid = step(mod(uv, .1), vec2(gridLineThickness));    

    fragColor = vec4(0., val * (grid.x + grid.y), 0., 1.);
    
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
} 