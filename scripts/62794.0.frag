/*
 * Original shader from: https://www.shadertoy.com/view/4tBGRz
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
float scl;

float det(mat2 A) {
    return A[0][0]*A[1][1] - A[1][0]*A[0][1];
}

vec2 warp(vec2 p) {
	
	vec2 o = vec2(4.0*cos(iTime), 4.0*sin(2.0*iTime));
	
	vec2 po = p-o;
	float r2 = dot(po,po);
	float dr = -0.7*exp(-r2/16.0);
	return p + dr*po;

}

// change #if 0 to #if 1 to use built-in differencing
mat2 jacWarp(vec2 p) {
#if 0
    return mat2(dFdx(warp(p)), dFdy(warp(p)))/scl;
#else    
	vec2 h = vec2(0.001, 0.0);
	vec2 jx = (warp(p+h.xy) - warp(p-h.xy))/(2.0*h.x);
	vec2 jy = (warp(p+h.yx) - warp(p-h.yx))/(2.0*h.x);
	return mat2(jx, jy);
#endif
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    
    scl = 30.0 / iResolution.x;

	vec2 uv = (fragCoord.xy - 0.5*iResolution.xy) * scl;
	
	mat2 J = jacWarp(uv);

    uv = warp(uv);
	float dJ = abs(det(J));
		
	uv = (fract(uv + 0.5) - 0.5);
	
	const float rad = 2.0;
	float d = smoothstep((rad)*scl, (rad+1.0)*scl, length(uv)/sqrt(dJ));
	vec2 g = smoothstep(0.5*scl, 1.5*scl, abs(uv)/sqrt(dJ));
	
	fragColor.xyz = min(vec3(d), vec3(g.x, min(g.x, g.y), g.y));
    
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}