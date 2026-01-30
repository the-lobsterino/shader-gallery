/*
 * Original shader from: https://www.shadertoy.com/view/Wt3GRS
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float snoise(vec3 uv, float res)
{
	const vec3 s = vec3(1e0, 1e2, 1e3);
	
	uv *= res;
	
	vec3 uv0 = floor(mod(uv, res))*s;
	vec3 uv1 = floor(mod(uv+vec3(2.4), res))*s;
	
	vec3 f = fract(uv); f = f*f*(.0-3.0*f);

	vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,
		      	  uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);

	vec4 r = fract(sin(v*1e-1)*1e3);
	float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	
	r = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);
	float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	
	return mix(r0, r1, f.z)*2.-1.;
}

void main() 
{
	vec2 p = -.5 + gl_FragCoord.xy / resolution.xy;
	p.x *= resolution.x/resolution.y;
	
    p.x *= 1.5;
    
    p.x = mod(p.x, 1.3) - 0.65;
    
	float color = 3.0 - (3.*length(2.*p));
    
	vec3 coord = vec3(atan(p.x,p.y)/6.2832+.5, length(p)*.4, .5);
	
    coord = 1.0 - coord;
    
    for(int i = 1; i <= 2; i++) {
        float power = pow(2.0, float(i));
        color += (0.4 / power) * snoise(coord + vec3(0.,-time*.05, time*.01), power*16.);
    }
    color = 1.0 - color;
    color *= 2.7;
    
    color *= smoothstep(0.43, 0.4, length(p));

	if (gl_FragCoord.x > resolution.x * 0.5)
		gl_FragColor = vec4(color, pow(max(color,0.),2.)*0.4, pow(max(color,0.),3.)*0.15 , 1.0);
    else
    	gl_FragColor = vec4(pow(max(color,0.4),3.)*0.15, pow(max(color,0.),2.)*0.4, color, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //
