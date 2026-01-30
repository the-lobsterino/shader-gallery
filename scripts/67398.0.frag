/*
 * Original shader from: https://www.shadertoy.com/view/WlSyDm
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
void hash22(vec2 p, out vec2 Out)
{
    vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx + 33.33);
    Out = fract((p3.xx + p3.yz) * p3.zy);
}
float noise2( in vec2 p )
{
	const float K1 = (sqrt(3.)-1.)/2.;
	const float K2 = (3.-sqrt(3.))/6.;
	
	vec2 i = floor( p + (p.x+p.y)*K1 );
	
	vec2 a = p - i + (i.x+i.y)*K2;
	vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
	vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0*K2;
	
	vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	vec2 hashA, hashB, hashC;
    hash22(i+0.0,hashA);
    hash22(i+o,hashB);
    hash22(i+o,hashC);
	vec3 n = h*h*h*h*vec3( dot(a,hashA), dot(b,hashB), dot(c,hashC));
	
	return dot( n, vec3(70.0) );
}


float fbm(vec2 uv)
{
	float f;
	mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
	f  = 0.5000*noise2( uv ); uv = m*uv;
	f += 0.2500*noise2( uv ); uv = m*uv;
	f += 0.1250*noise2( uv ); uv = m*uv;
	f += 0.0625*noise2( uv ); uv = m*uv;
	f = 0.5 + 0.5*f;
	return f;
}

void Fire(vec2 uv,out vec3 Out)
{
	vec2 q = uv;

    float strength = floor(q.x+1.);
	float T3 = strength*iTime;
	q.x = mod(q.x,1.)-0.5;
	q.y -= 0.25;
	float n = fbm(strength*q.yx - vec2(0,T3));
	float c = 1. - 16. * pow( max( 0., length(q*vec2(1.8+q.y*1.5,.75) ) - n * max( 0., q.y+.25 ) ),1.2 );
	float c1 = n * c * (1.5-pow(1.25*uv.y,4.));

	c1=clamp(c1,0.,1.);

	vec3 col = vec3(1.5*c1, 1.5*c1*c1*c1,0.);
	float a = c * (1.-pow(uv.y,3.));
    Out=mix(vec3(0.),col,a);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    vec3 color;
    Fire(uv,color);
	fragColor = vec4(color , 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}