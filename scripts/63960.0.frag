/*
 * Original shader from: https://www.shadertoy.com/view/XsGcDh
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
float Disition(vec3 ro, vec3 rd, vec3 p) {
 	return length(cross(p-ro, rd))/length(rd);   
}


float DrawPoint(vec3 ro, vec3 rd, vec3 p) {
    float d = Disition(ro, rd, p);
    d = smoothstep(0.06, 0.05, d);
    return d;
}

vec3 DrawRectangle(float k, float is, float ie, float js, float je, vec3 color, vec3 ro, vec3 rd) {
 	vec3 col = vec3(0.0);
	float i = is;
    for(int ii=0; ii<100; ++ii) {
	if (i > ie) break;
	float j = js;
        for(int jj=0; jj<100; ++jj) {
	    if (j > je) break;
            if(i == is || i == ie || 
               j == js || j == je ||
               k == 0.0 || k == 1.0) {

                col += DrawPoint(ro, rd, vec3(i, j, k)) * color;
            }
	    j += 0.2;
        }
	i += 0.2;
    }
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float t = iTime;
    vec2 uv = ( fragCoord - .5*iResolution.xy) / iResolution.y;
    
    vec3 ro = vec3(3.0*sin(t), sin(t), -8.0*cos(t));
    float zoom = 1.0;
    
    vec3 lookAt = vec3(0.5);
    vec3 f = normalize(lookAt - ro);
    vec3 r = cross(vec3(0.0, 1.0, 0.0), f);
    vec3 u = cross(f, r);
    
    vec3 c = ro + f*zoom;
    vec3 i = c + uv.x*r + uv.y*u;
    
    vec3 rd = i - ro;
    
    float d = 0.0;
    vec3 col = vec3(0.0);
    
    for(float k = 0.0; k <= 1.0; k += 0.2) {
        
        col += DrawRectangle(k, 0.0, 2.0, -1.0, 0.0, vec3(0.99, 0.20, 0.58), ro, rd);
        col += DrawRectangle(k, -1.0, 0.0, -2.0, 0.0, vec3(0.0, 0.75, 0.94), ro, rd);
		col += DrawRectangle(k, -2.0, 0.0, 0.0, 1.0, vec3(0.21, 0.81, 0.33), ro, rd);
		col += DrawRectangle(k, 0.0, 1.0, 0.0, 2.0, vec3(1.0, 0.91, 0.28), ro, rd);

    }   
    
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}