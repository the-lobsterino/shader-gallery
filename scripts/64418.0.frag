

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

#define MOD3 vec3(443.8975, 397.2973, 491.1871) // uv range
//#define MOD3 vec3(.1031, .11369, .13787) // int range
float hash11(float p) {
	vec3 p3  = fract(vec3(p) * MOD3);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

/*
 * Original shader from: https://www.shadertoy.com/view/XtdyRl
 */

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define PI 3.1415926535

mat2 rot( in float a ) 
{
    float c = cos(a);
    float s = sin(a);
	return mat2(c,s,-s,c);	
}

//Adapted from https://www.shadertoy.com/view/XtlXz7
float drawLine(vec2 uv, vec2 p1, vec2 p2, float Thickness, float blur) 
{

  float a = abs(distance(p1, uv));
  float b = abs(distance(p2, uv));
  float c = abs(distance(p1, p2));
  
  float d = sqrt(c*c + Thickness*Thickness);

  if ( a >= d || b >= d )
  {
  	return smoothstep(Thickness, Thickness-blur, min(distance(p1, uv),distance(p2, uv)));
  }

  float p = (a + b + c) * 0.5;

  // median to (p1, p2) vector
  float h = 2.0 / c * sqrt( p * ( p - a) * ( p - b) * ( p - c));
  
  return smoothstep(Thickness, Thickness-blur, h);
}

float circle(vec2 uv, vec2 p, float r, float blur)
{
    return smoothstep(r, r-blur, length(uv - p));
}

float thumb(vec2 uv, vec2 p, float newtime)
{
    uv -= p;
    uv *= rot(PI/14.);
    float c = drawLine(uv, vec2(0,0.1), vec2(0.65,0.1), 0.08, 0.01);
    c += drawLine(uv, vec2(0,-0.04), vec2(0.35,-0.04), 0.08, 0.01);
    c += drawLine(uv, vec2(0,-0.18), vec2(0.3,-0.18), 0.075, 0.01);
    c += drawLine(uv, vec2(0,-0.30), vec2(0.2,-0.30), 0.07, 0.01);
    c += circle((uv * vec2(1.2,1)) + uv.y*0.1, vec2(0,-0.105), 0.3,0.01);
    vec2 q = vec2(0);
    uv*= rot(-PI/20. + sin(newtime));
        uv.y -= 0.2;
    uv.x -= 0.01;
    q.x += uv.y*0.7;
    c += drawLine(uv, vec2(0,-0.105) + q, vec2(0,0.2), 0.10 - uv.y*0.1, 0.01);
    
    c = clamp(c, 0.,1.);
    return c;
}

vec4 head(vec2 uv, vec2 p, float scale, float newtime)
{
    uv -= p;
    float c = circle(uv, vec2(0), .8, .01);
    vec4 col = mix(vec4(0), c*vec4(1,0.8,0.3,1.), c);
    c = circle(uv * vec2(1.3,1), vec2(0.35,0.2), .15, .01);
    c += circle(uv * vec2(1.3,1), vec2(-0.35,0.25), .15, .01);
    
    float d = 0.275-uv.x;
    d *= d;
    
    c += drawLine(uv, vec2(0.1,0.35- d + sin(newtime)*0.05), vec2(0.45,0.35- d + sin(newtime)*0.05), 0.05, 0.01);
    
    d = -0.275-uv.x;
    d *= d;
    
    c += drawLine(uv, vec2(-0.1,0.55- d + sin(newtime)*0.05), vec2(-0.45,0.55- d + sin(newtime)*0.05), 0.05, 0.01);
    
    d = -0.1-uv.x;
    d *= d;
    
    c += drawLine(uv, vec2(-0.2,-0.2- d+ cos(newtime)*0.05), vec2(0.2,-0.2- d), 0.05, 0.01);
    
    c = clamp(c, 0.,1.);

    col = mix(col, c*vec4(0.4,0.27,0,1.), c);
    
    c = thumb(uv, vec2(-0.5,-0.7), newtime);
    
    col = mix(col, c*vec4(0.95,0.6,0.05,1.), c);
    
    
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = ( 2.*fragCoord - iResolution.xy )/ iResolution.y;

	// --------[ Original ShaderToy ends here ]---------- //

	uv.y += .5;
	
	vec4 outcol;
	
    //fragColor = head(uv, vec2(0,0.15), 1.);
	
	outcol = head(2.*vec2(fract(uv.x)-.5, uv.y), vec2(0,0.15), 1., time+2.827*hash11(floor(uv.x)));
	
	for(float i=1.; i<8.; i++) {		
		uv *= 2.;
		uv.y -= 1.25;
		vec4 tempcol = head(2.*vec2(fract(uv.x)-.5, uv.y), vec2(0,0.15), 1., time+i*2.73+2.827*hash11(floor(uv.x)));
		tempcol.rgb *= 1.-i/8.;
		outcol = mix(outcol, tempcol, 1.-outcol.a);
	}
	
	fragColor= outcol;
}


void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}