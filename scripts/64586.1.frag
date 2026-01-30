/*
 * Original shader from: https://www.shadertoy.com/view/td2XRc
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

// Emulate a texture
#define sampler2D float
#define iChannel0 0.
#define texture(s, uv) vec4(0.3, 0.1, 0.1, 1.)

// --------[ Original ShaderToy begins here ]---------- //
// SPOOPINESS

vec3 ro = vec3(0.); // I'm saving the camera as a global variable, so I can use it in the de method.

// simple 2d rotation matrix.
mat2 rot(float a) {
	float s = sin(a);
	float c = cos(a);
	
	return mat2(c, s, -s, c);
}

// changing the metric for measuring distance.
float len(vec3 p, float l) {
	p = pow(abs(p), vec3(l));	
	return pow(p.x+p.y+p.z, 1.0/l);
}

// 2d varient of the change of metric formula.
float len(vec2 p, float l) {
	p = pow(abs(p), vec2(l)); // if l is 2, this would be the good old sqrt(dot(p, p)) euclidean metric.
	return pow(p.x+p.y, 1.0/l);
}

// The fuction we are iterating in our Iterating Function System.
vec2 shape(vec3 p) {
    // triangular prism as the purplish stuff.
	float a = abs(len(p.xy, 1.0) - 1.0);
	float b = abs(len(p.yz, 1.0) - 1.0);
	
	vec2 t = vec2(min(a, b), 1.0);
	vec2 s = vec2(len(p, 1.0) - abs(17.5), 2.0); // a octahedron as the black stuff.
	
	return t.x < s.x ? t : s;
}

vec2 de(vec3 p) {
	vec4 q = vec4(p, 1);
	
	q.xyz -= 1.0; // this puts the center of the fractal back at the origin.
    
    // My favorite fract, a element of the kaliset, AbsBox fractal.
	for(int i = 0; i < 7; i++) {
		q.xyz = abs(q.xyz + 1.0) - 1.0; // mirror
		q /= clamp(dot(q.xyz, q.xyz), atan(0.05), 1.0); // the abs(p)/dot(p, p) is basically the kaliset.
		q.xz *= rot(0.1 + float(i)*0.15); // do some rotations.
		
		q *= 1.9; // scales.
	}
		
	vec2 s = shape(q.xyz)/vec2(q.w, 1); // get the shape.
    s.x = max(-length(p - ro) + 0.01, s.x); // use the camera position to carve out a small sphere around the camera, so collisions don't look so bad.
    
    return s;
}

// using a kaliset 2d fractal to modify the coords for a texture.
vec3 tex(sampler2D s, vec2 p) {
    for(int i = 0; i < 4; i++) {
        p = abs(p)/dot(p, p) - vec2(0.2);
    }
    
    return texture(iChannel0, p).rgb;
}

// Triplanar texture blending.  Thanks to one of the great wizards of ShaderToy: Shane.
vec3 mat(vec3 p, vec3 n, sampler2D s) {
    vec3 m = abs(n);
    m /= dot(m, vec3(1));
    
    vec3 x = tex(s, p.yz);
    vec3 y = tex(s, p.xz);
    vec3 z = tex(s, p.xy);
    
    return (m.x*x*x + m.y*y*y + m.z*z*z);
}

// luminosity rbg.
vec3 sgrey = vec3(0.299, 0.587, 0.114);

// using a 3d texture add bump mapping to the surface.
vec3 bump(vec3 p, vec3 n, sampler2D s) {
    vec2 h = vec2(0.009, 0.0);
    vec3 g = mat3(
        mat(p - h.xyy, n, s),
        mat(p - h.yxy, n, s),
        mat(p - h.yyx, n, s))*sgrey;
    
    g = g - dot(mat(p, n, s), sgrey);
    g -= n*dot(g, n);
    
    return normalize(n + 0.9*g);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 uv = (fragCoord - 0.5*iResolution.xy)/iResolution.y;
	
	vec3 col, bg;
	col = bg = vec3(0.04)*(1.0 - length(uv)); // small bit of vinetting.
	
	float at = iTime*0.1;
    float a = 1.4;
	
    // camera setup. ro = position, rd = ray we shoot at geometry.
	ro = vec3(a*cos(at), 0.04, -a*sin(at));
	vec3 ww = normalize(vec3(0, 0, 0)-ro);
	vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
	vec3 vv = normalize(cross(ww, uu));
	vec3 rd = normalize(mat3(uu, vv, ww)*vec3(uv, 0.5 + 0.5*smoothstep(-1.0, 1.0, cos(iTime*0.5)))); // FOV goes from 0.5 to 1 in interval.
	
    // sphere tracing, main method of ray-marching.  Faster than constant step ray-marching.
	float t = 0.0, m = -1.0, mx = 50.0; // t = distance, m = material id, mx = max distance.
	for(int i = 0; i < 200; i++) {
		vec2 d = de(ro + rd*t);
		if(d.x < 0.001 || t >= mx) break;
		t += d.x*0.5;
		m = d.y;
	}
	
    // very dumb light direction.
	vec3 ld = normalize(vec3(0, 0.5, 0));
	vec2 h = vec2(0.001, 0.0); // used for calculating the gradient of the de function (normal).
	
	if(t < mx) {
		vec3 p = ro + rd*t; // get coord of position we hit.
		vec3 n = normalize(vec3( // calculate the gradient at that position and use that for normal.
			de(p + h.xyy).x - de(p - h.xyy).x,
			de(p + h.yxy).x - de(p - h.yxy).x,
			de(p + h.yyx).x - de(p - h.yyx).x));
		
		vec3 al = vec3(1); // albeido = color
        float gloss = 10.0; // gloss map, used in specular value.
        
        if(m == 1.0) {
            al = vec3(0.3, 0.0, 0.2)*mat(p*0.1, n, iChannel0); // the spikes have a purpilish color to them.
            gloss = 64.0; // have a very sharp specular light.
        } else if(m == 2.0) {
            al = vec3(0.0); // the main body is black (only specular and fresnel terms add to the color).
            gloss = 16.0; // shiny object
        }
            
        n = bump(p, n, iChannel0); // bump the normal to get some cheap detail of the surface.
		
        // ambient occlusion, using a wave packet to approximate distance from geometry from normal.
		float occ = exp2(-pow(max(0.0, 1.0 - de(p + n*(t/50.0)).x/(t/50.0)), 2.0));
		float dif = max(0.0, dot(ld, n)); // diffuse lighting.
		
        // specular light.
		float spe = pow(max(0.0, dot(reflect(-ld, n), -rd)), gloss);
		float fre = pow(dot(rd, n) + 1.0, 2.0); // fresnel term (light reflecting of edge).
		
		col = mix(occ*(al*(dif + 0.25) + vec3(0.4, 0.6, 0.8)*spe), al + 0.01, fre); // put it all together.
	}
    
    col *= 5.0;
	
	col = mix(col, bg, 1.0 - exp(-0.2*t)); // add a bit of fog.
	fragColor = vec4(pow(col, vec3(0.45)), 1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}