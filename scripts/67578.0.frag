/* 
 * Original shader from: https://www.shadertoy.com/view/Wsy3z3
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
// fork of https://www.shadertoy.com/view/3dVGDW

const float PARTITIONS = 10.;

float dtoa(float d, float amount){
    return 1. / clamp(d*amount, 1., amount);
}

vec4 hash42(vec2 p)
{
	vec4 p4 = fract(vec4(p.xyxy) * vec4(.1031, .1030, .0973, .1099));
    p4 += dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}

float sdroundedthing(vec2 uv, float size) {
    float ret = length(uv)-size;
    if (uv.y < 0.) {
        ret = min(ret, max(uv.x-size, -uv.x-size));
    }
    return ret;
}
// helps movement of ghosts. probably a cheaper way to accomplish this.
float smoothsquare(float t, float f)
{
    const float pi = atan(1.)*4.;
    const float delta = .03;// smoothness
    const float A = 1.;// amp
    float y = (A/atan(1./delta))*atan(sin(2.*pi*t*f)/delta);
    return y;
}

void mainImage( out vec4 o, in vec2 fragCoord )
{
    vec2 R = iResolution.xy;
    float t = (iTime+1e2)*.2;
    vec2 uv = fragCoord/iResolution.xy-.5;
    vec2 N = uv;
    uv.x *= R.x / R.y;
    uv.x += .5;
    vec2 uvghost = uv;

    uv.y += t*.3;
    
    // behind the glass...
    float sdghost = 1e6;
    const float ghosts = 9.;
    for (float i = 0.;i < ghosts; ++ i) {
        vec4 h = hash42(vec2(i+2e2));
        vec2 uvg2 = uvghost;
    	uvg2.x -= (fract(t*h.x+smoothsquare(t+h.z*2., .5)*.2)-.5)*3.;
        uvg2.y *= sign(h.w-.5);// ceiling
        uvg2.y += h.y*.5;
        sdghost = min(sdghost, sdroundedthing(uvg2, .0));
    }
    
    o = vec4(mix(1.,smoothstep(.0,.4,sdghost), .9));
    //return;

    N *= .98;// oob artifact quickfix

    vec2 cellUL = floor(uv);
    vec2 cellBR = cellUL + 1.5;
    vec2 seed = cellUL;// top-level cell ID

    for(float i = 1.; i <= PARTITIONS; ++ i) {
        vec4 h = hash42(seed+(vec2(cellBR.x, cellUL.y)+10.));
        float dl = abs(uv.x - cellUL.x);// distance to edge of cell, left edge
        dl = min(dl, length(uv.y - cellUL.y));// bottom (inv y)
        dl = min(dl, length(uv.x - cellBR.x));// right
        dl = min(dl, length(uv.y - cellBR.y));// top

        float r = max(fract(N.x-.5), fract(.5-N.x));
        r = max(r, fract(.5-N.y));
        r = max(r, fract(N.y-.5));
        r = 1.-r;
        float col2 = 1.5-dtoa(dl, (h.z+.05)*6000.*pow(r, 1.5));
        vec3 col = h.xyz;
        o.rgb *= col2;
        if (h.w < .1)// sometimes color a window
        	o.rgb *= mix(col, vec3(col.r+col.g+col.b)/3.,.8);
        
        h.y = mix(.5, h.y, .2);// favor dividing evenly
        vec2 pt = mix(cellUL, cellBR, h.y);

        if (uv.x < pt.x) {// descend into quadrant
            if (uv.y < pt.y) {
                cellBR = pt.xy;
            } else {
              	cellUL.y = pt.y;
              	cellBR.x = pt.x;
            }
        } else {
            if (uv.y > pt.y) {
                cellUL = pt.xy;
            } else {
                cellUL.x = pt.x;
                cellBR.y = pt.y;
            }
	    }
    }
    
    o = clamp(o,0.,1.);
    o = pow(o,o-o+.7);
    o.a = 1.;
}


// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}