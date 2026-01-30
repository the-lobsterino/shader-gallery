/*
 * Original shader from: https://www.shadertoy.com/view/wl2GD1
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


vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

float hexDist(vec2 n) {
	n = abs(n);
    float c = dot(n, normalize(vec2(1., 1.73)));
    c = max(c, n.x);
    return c;
}

bool inHex(vec2 n, float r) {
	return hexDist(n) < r;// && hexDist(n) > r-.05;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	float s = 20. + 15. * sin(cos((iTime * .5)));    
    float r = .5;
    
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord / iResolution.y;

    uv -= vec2(1. + .15 *cos(iTime * .2), .5 + .15*sin(iTime * .3));
    uv = rotate(uv, 6.28 * fract(.1 * iTime));
    
    
    vec2 hex = vec2(1., 1.73);
    vec2 halfHex = hex * .5;
    
    
    vec2 f1 = mod(uv * s, hex) - halfHex;
    vec2 f2 = mod(uv * s - halfHex, hex) - halfHex;
    
    vec2 gv;
    if (length(f1) < length(f2)){
    	gv = f1;
    } else {
    	gv = f2;
    }
    vec2 id = (uv * s) - gv;

    vec3 col = vec3(0.);
    
    float r2 = cos(.5*iTime+id.x+id.x*id.x+id.y*cos(id.x * id.y)) * r;
    float r3 = sin(.5*iTime-id.x-id.x*id.x-id.y) * r;
    
    col.rg = (id.xy+s) * (1./s);
  	col.rg *= cos(col.rg) / sin(col.rg);
    
    col.rgb *= inHex(gv, r2) ? 1. : .5; 
    col.rgb -= inHex(gv, r - .05) ? .5 : 0.;
    
    col.b = cos(col.r) * .25;
    
    col.rgb += .5 + .25 * cos(iTime * .1);
    
    
    
    
    fragColor = vec4(col,1.0);
}


// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}