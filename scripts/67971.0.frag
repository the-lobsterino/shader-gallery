/*
 * Original shader from: https://www.shadertoy.com/view/MdV3W3
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
// from: http://stackoverflow.com/questions/35712480/how-to-draw-a-border-around-text-in-opengl

#define SC 0.05 // line scale
#define LW 0.02 // line width
#define C1 (vec2 p){return min(l(p,
#define C2 ),min(l(p,

// line segment
float l(vec2 p, float ax, float ay, float bx, float by)
{
    p = floor(p*500.+0.5)/800.;  // Größe

    vec2 a = vec2(ax,ay)*SC;
    vec2 b = vec2(bx,by)*SC;
    vec2 ab = b-a;return length(p-a-ab*clamp(dot(p-a,ab)/dot(ab,ab),0.0,1.0))-LW;
}

float A C1 1.,-8.,1.,-1.5 C2 1.,-1.5,5.,-1.5 C2 5.,-1.5,5.,-5. C2 5.,-5.,1.,-5. C2 1.,-5.,5.,-5.),l(p,5.,-5.,5.,-8.))))));}
float B C1 4.,-5.,4.,-1.5 C2 4.,-1.5,1.,-1.5 C2 1.,-1.5,1.,-8. C2 1.,-8.,5.,-8. C2 5.,-8.,5.,-5.),l(p,5.,-5.,1.,-5.))))));}
float C C1 5.,-1.5,1.,-1.5 C2 1.,-1.5,1.,-8.),l(p,1.,-8.,5.,-8.)));}
float D C1 1.,-8.,4.,-8. C2 4.,-8.,4.5,-7.5 C2 4.5,-7.5,5.,-6.25 C2 5.,-6.25,5.,-3.75 C2 5.,-3.75,4.5,-2. C2 4.5,-2.,4.,-1.5 C2 4.,-1.5,1.,-1.5),l(p,1.,-1.5,1.,-8.))))))));}
float E C1 5.,-1.5,1.,-1.5 C2 1.,-1.5,1.,-5. C2 1.,-5.,3.,-5. C2 3.,-5.,1.,-5. C2 1.,-5.,1.,-8.),l(p,1.,-8.,5.,-8.))))));}
float F C1 5.,-1.5,1.,-1.5 C2 1.,-1.5,1.,-5. C2 1.,-5.,3.,-5. C2 3.,-5.,1.,-5.),l(p,1.,-5.,1.,-8.)))));}
float G C1 5.,-2.5,5.,-1.5 C2 5.,-1.5,1.,-1.5 C2 1.,-1.5,1.,-8. C2 1.,-8.,5.,-8. C2 5.,-8.,5.,-5.),l(p,5.,-5.,3.5,-5.))))));}
float H C1 1.,-1.5,1.,-8. C2 1.,-8.,1.,-5. C2 1.,-5.,5.,-5. C2 5.,-5.,5.,-1.5),l(p,5.,-1.5,5.,-8.)))));}
float I C1 1.5,-1.5,4.5,-1.5 C2 4.5,-1.5,3.,-1.5 C2 3.,-1.5,3.,-8. C2 3.,-8.,1.5,-8.),l(p,1.5,-8.,4.5,-8.)))));}
float J C1 1.5,-8.,3.,-8. C2 3.,-8.,4.,-7. C2 4.,-7.,4.,-1.5),l(p,4.,-1.5,1.5,-1.5))));}
float K C1 1.,-1.5,1.,-8. C2 1.,-8.,1.,-5. C2 1.,-5.,2.5,-5. C2 2.5,-5.,5.,-1.5 C2 5.,-1.5,2.5,-5.),l(p,2.5,-5.,5.,-8.))))));}
float L C1 1.,-1.5,1.,-8.),l(p,1.,-8.,5.,-8.));}
float M C1 1.,-8.,1.,-1.5 C2 1.,-1.5,3.,-4. C2 3.,-4.,5.,-1.5),l(p,5.,-1.5,5.,-8.))));}
float N C1 1.,-8.,1.,-1.5 C2 1.,-1.5,5.,-8.),l(p,5.,-8.,5.,-1.5)));}
float O C1 5.,-1.5,1.,-1.5 C2 1.,-1.5,1.,-8. C2 1.,-8.,5.,-8.),l(p,5.,-8.,5.,-1.5))));}
float P C1 1.,-8.,1.,-1.5 C2 1.,-1.5,5.,-1.5 C2 5.,-1.5,5.,-5.),l(p,5.,-5.,1.,-5.))));}
float Q C1 5.,-8.,5.,-1.5 C2 5.,-1.5,1.,-1.5 C2 1.,-1.5,1.,-8. C2 1.,-8.,5.,-8.),l(p,5.,-8.,3.5,-6.5)))));}
float R C1 1.,-8.,1.,-1.5 C2 1.,-1.5,5.,-1.5 C2 5.,-1.5,5.,-5. C2 5.,-5.,1.,-5. C2 1.,-5.,3.5,-5.),l(p,3.5,-5.,5.,-8.))))));}
float S C1 5.,-1.5,1.,-1.5 C2 1.,-1.5,1.,-5. C2 1.,-5.,5.,-5. C2 5.,-5.,5.,-8.),l(p,5.,-8.,1.,-8.)))));}
float T C1 3.,-8.,3.,-1.5 C2 3.,-1.5,1.,-1.5),l(p,1.,-1.5,5.,-1.5)));}
float U C1 1.,-1.5,1.,-8. C2 1.,-8.,5.,-8.),l(p,5.,-8.,5.,-1.5)));}
float V C1 1.,-1.5,3.,-8.),l(p,3.,-8.,5.,-1.5));}
float W C1 1.,-1.5,1.,-8. C2 1.,-8.,3.,-6. C2 3.,-6.,5.,-8.),l(p,5.,-8.,5.,-1.5))));}
float X C1 1.,-1.5,5.,-8. C2 5.,-8.,3.,-4.75 C2 3.,-4.75,5.,-1.5),l(p,5.,-1.5,1.,-8.))));}
float Y C1 1.,-1.5,3.,-5. C2 3.,-5.,3.,-8. C2 3.,-8.,3.,-5.),l(p,3.,-5.,5.,-1.5))));}
float Z C1 1.,-1.5,5.,-1.5 C2 5.,-1.5,3.,-5. C2 3.,-5.,1.,-8.),l(p,1.,-8.,5.,-8.))));}
//float _ C1 0.,-0.,0.,-0.0 C2 0.,-0.0,0.,-0. C2 0.,-0.,0.,-0.),l(p,0.,-0.,0.,-0.))));}


void mainImage2( out vec4 fragColor, in vec2 fragCoord )
{   
    float t = iTime;  
    vec2 uv = (2.0 * fragCoord.xy - iResolution.xy) / iResolution.yy;

    uv.x += 0.9;
    uv.x *= abs(sin(uv.x+t*1.0)*0.1+1.0)+0.50;
    uv.y *= abs(cos(uv.x+t*1.0)+1.0)+1.0;
    uv.xy *= 0.99;
    vec3 col = vec3(0);
    float d = 1.0;

    d = min(d,C(uv-vec2(-2.0,0.5)));
    d = min(d,O(uv-vec2(-1.5,0.5)));
    d = min(d,M(uv-vec2(-1.0,0.5)));
    d = min(d,E(uv-vec2(-0.5,0.5)));

	
    d = min(d,T(uv-vec2( 0.55,0.5)));
    d = min(d,O(uv-vec2( 1.15,0.5)));
	
    d = min(d,J(uv-vec2( 2.25,0.5)));
    d = min(d,E(uv-vec2( 2.75,0.5)));
    d = min(d,S(uv-vec2( 3.25,0.5)));
    d = min(d,U(uv-vec2( 3.75,0.5)));
    d = min(d,S(uv-vec2( 4.25,0.5)));	
    col = mix(vec3(1),col,smoothstep(d,d+0.5,0.0));

    fragColor = vec4(vec3(1.-40.0*d),1.0);
}

#define DIST 0.005
#define ITR 5
#define THRESH 0.9

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{   
    vec2 uv = fragCoord.xy / iResolution.xy;
    float x, y;
    vec4 neighborColor;
    float dist_sq;

    mainImage2(fragColor, fragCoord);

    for (int i = 0; i < ITR; i++) {
        x = mix(uv.x - DIST, uv.x + DIST, float(i) / float(ITR - 1));
        for (int k = 0; k < ITR; k++) {
            y = mix(uv.y - DIST, uv.y + DIST, float(k) / float(ITR - 1));
            dist_sq = pow(uv.x-x, 2.0) + pow(uv.y-y, 2.0);
            if (dist_sq < DIST * DIST) {
                mainImage2(neighborColor, vec2(x, y) * iResolution.xy);
                if (neighborColor.r > THRESH && fragColor.r < THRESH) {
                    fragColor = vec4(0.8, 0, 0.90, 1.0);
                } else {
                    // fragColor = vec4(0, 1, 0, 1);
                }
            }
        }
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}