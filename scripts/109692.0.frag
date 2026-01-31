/*
 * Original shader from: https://www.shadertoy.com/view/lsKGzG
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
//function to generate noise seed
float hash(vec2 uv) {
    float f = fract(cos(sin(dot(uv, vec2(.009123898, .0033))) * 48.512353) * 11111.5452313);
    return f;
}
//interpolate
float noise(vec2 uv)
{
    vec2 fuv = floor(uv);
    vec4 cell = vec4(
        	hash(fuv + vec2(0,0)),
            hash(fuv + vec2(0,1)),
            hash(fuv + vec2(1,0)),
            hash(fuv + vec2(1,1))
        );
    vec2 axis = mix(cell.xz, cell.yw, fract(uv.y));
    return mix(axis.x, axis.y, fract(uv.x));
}

float fbm(vec2 uv){
	float f = 0.;
    float r = 1.;
    for (int i = 0; i < 8; ++i){
    	f += noise(uv*r)/(r *= 2.);
    }
    return f/(1.-1./r);
}

vec3 BlueSky(vec2 uv)
{
    vec3 skyColor = vec3(0.4,0.7,.9);
    vec3 skyColorb = vec3(0.9,0.9,0.9);
    //cosine interpolation
    float ft = uv.y * 3.1415927;
    //cosine interpolation changing to quick use exp to slow it down
   	ft = (1.- cos(ft))*.5*exp(11.4*(1.-uv.y));
    
    return skyColorb*(1.-ft)+skyColor*ft;
}

vec3 GlowSky(vec2 uv)
{
    //normalize
    uv.x = uv.x/iResolution.y*iResolution.x;
    vec3 glowColor = vec3(1.0,88.0,1.0);
   	//sun point
    vec2 sunPoint = vec2(0.1,0.85);
    //use exponential to model sun light
    vec2 vecDis = uv - sunPoint;
    float ft = length(vecDis);
    ft = exp(-1.6*ft);
    //limit the parameter avoid the light too intense

    
    //calculate the lensflare
    float ang = atan(vecDis.y, vecDis.x);
    float alterScale = exp(-2.9)*0.8;
    float flareColor = ft*sin(fbm(vec2(ang,0.0)+iTime*0./8.)*16.0+iTime)*alterScale;
    //smooth the flareColor
    flareColor = smoothstep(0.0,0.12,flareColor)*ft*0.1;
  
    ft = ft+flareColor;   
    ft = min(0.95,ft);
    return glowColor*ft;
}

//eda model from gltracy

// ray marching
const int max_iterations = 128;
const float stop_threshold = 0.01;
const float grad_step = 0.05;
const float clip_far = 1000.0;

// math
const float PI = 3.14159265359;
const float DEG_TO_RAD = PI / 180.0;

mat3 roty( float angle ) {
	float c = cos( angle );
	float s = sin( angle );
	
	return mat3(
		c  , 0.0, -s  ,
		0.0, 1.0, 0.0,
		s  , 0.0, c  
	);
}

mat3 rotzx( vec2 angle ) {
	vec2 c = cos( angle );
	vec2 s = sin( angle );
	
	return
	mat3(
		c.y, s.y, 0.0,
		-s.y, c.y, 0.0,
		0.0, 0.0, 1.0
	) *
	mat3(
		1.0, 0.0, 0.0,
		0.0, c.x, s.x ,
		0.0, -s.x, c.x
	);
}

// distance function
float dist_sphere( vec3 pos, float r ) {
	return length( pos ) - r;
}

float dist_box( vec3 pos, vec3 size ) {
	return length( max( abs( pos ) - size, 0.0 ) );
}

float dist_cone( vec3 p, float r, float h )
{
	vec2 c = normalize( vec2( h, r ) );
    float q = length(p.xy);
    return max( dot(c,vec2(q,p.z)), -(p.z + h) );
}

float dist_capsule( vec3 p, vec3 a, vec3 b, float r )
{
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

vec2 princess( vec3 p ) {
	p = vec3( p.x,abs(p.y),p.z );
	
	// hat
	float d0 = dist_cone( roty( radians( 70.0  ) ) * ( p - vec3( -3.4, 0.0, 2.04 ) ), 0.97, 3.3 );
	// skirt
	float d1 = dist_cone( roty( radians( -10.0 ) ) * ( p - vec3( 0.03, 0.0, -0.1 ) ), 1.6, 2.6 );
	// head
	float d2 = dist_sphere( p + vec3( 0.0, 0.0, -0.8 ), 1.0 );
	// neck
	float d3 = dist_capsule( p, vec3( 0.0, 0.0, -0.5 ), vec3( 0.0, 0.0, 1.0 ), 0.18 );
	// legs
	float d4 = dist_capsule( p + vec3( 0.0, -0.4, 0.0 ), vec3( 0.0, 0.0, -4.6 ), vec3( 0.0, 0.0, -2.0 ), 0.15 );
	// feet
	float d5 = dist_cone( roty( -90.0 * DEG_TO_RAD ) * ( p + vec3( -0.53, -0.4, 4.58 ) ), 0.16, 0.5 );

	float g0 = min( min( d0, d1 ), min( d4, d5 ) );

	float d = g0;
	float id = 1.0;
	
	if ( d > d3 ) { d = d3; id = 0.0; }
	if ( d > d2 ) { d = d2; id = step( 0.2, p.x ); }
	
	return vec2( d, id );
}

// distance
vec2 dist_field( vec3 p ) {
	return princess( p + vec3( 0.0, 0.0, -0.85 ) );
}

// gradient
vec3 gradient( vec3 pos ) {
	const vec3 dx = vec3( grad_step, 0.0, 0.0 );
	const vec3 dy = vec3( 0.0, grad_step, 0.0 );
	const vec3 dz = vec3( 0.0, 0.0, grad_step );
	return normalize (
		vec3(
			dist_field( pos + dx ).x - dist_field( pos - dx ).x,
			dist_field( pos + dy ).x - dist_field( pos - dy ).x,
			dist_field( pos + dz ).x - dist_field( pos - dz ).x			
		)
	);
}

// ray marching
vec2 ray_marching( vec3 origin, vec3 dir, float start, float end ) {
	float depth = start;
	for ( int i = 0; i < max_iterations; i++ ) {
		vec2 hit = dist_field( origin + dir * depth );
		if ( hit.x < stop_threshold ) {
			return hit;
		}
		depth += hit.x;
		if ( depth >= end) {
			break;
		}
	}
	return vec2( end, -1.0 );
}

// othogonal ray direction
vec3 ray_dir( float fov, vec2 size, vec2 pos ) {
	vec2 xy = pos - size * 0.5;

	float cot_half_fov = tan( ( 90.0 - fov * 0.5 ) * DEG_TO_RAD );	
	float z = size.y * 0.5 * cot_half_fov;
	
	return normalize( vec3( xy, -z ) );
}

vec3 EvalPixel( vec2 pix ) {
	// default ray dir
	vec3 dir = ray_dir( 45.0, iResolution.xy, pix );
	
	// default ray origin
	vec3 eye = vec3( 0.0, 0.0, 13.0 );

	// rotate camera
	mat3 rot = rotzx( vec2( 70.0 * DEG_TO_RAD, 3.5 ) );
	dir = rot * dir;
	eye = rot * eye;
	
	// ray marching
	vec2 hit = ray_marching( eye, dir, 0.0, clip_far );
	if ( hit.x >= clip_far ) {
		return vec3(0.0);
        //return mix( vec3( 0.0, 0.3, 0.4 ), vec3( 0.17, 0.7, 0.7 ), pix.y / iResolution.y );
	}
	
	// shading
	return vec3( hit.y );
}

//add some snow
		vec2 mod289(vec2 x) {
		  return x - floor(x * (1.0 / 289.0)) * 289.0;
		}

		vec3 mod289(vec3 x) {
		  	return x - floor(x * (1.0 / 289.0)) * 289.0;
		}
		
		vec4 mod289(vec4 x) {
		  	return x - floor(x * (1.0 / 289.0)) * 289.0;
		}
		vec3 permute(vec3 x) {
		  return mod289(((x*34.0)+1.0)*x);
		}

		vec4 permute(vec4 x) {
		  return mod((34.0 * x + 1.0) * x, 289.0);
		}


float worleyNoise(vec2 P){
		#define K 0.142857142857 // 1/7
		#define K2 0.0714285714285 // K/2
		#define jitter 0.8 // jitter 1.0 makes F1 wrong more often
				
		vec2 Pi = mod(floor(P), 289.0);
		vec2 Pf = fract(P);
		vec4 Pfx = Pf.x + vec4(-0.5, -1.5, -0.5, -1.5);
		vec4 Pfy = Pf.y + vec4(-0.5, -0.5, -1.5, -1.5);
		vec4 p = permute(Pi.x + vec4(0.0, 1.0, 0.0, 1.0));
		p = permute(p + Pi.y + vec4(0.0, 0.0, 1.0, 1.0));
		vec4 ox = mod(p, 7.0)*K+K2;
		vec4 oy = mod(floor(p*K),7.0)*K+K2;
		vec4 dx = Pfx + jitter*ox;
		vec4 dy = Pfy + jitter*oy;
		vec4 d = dx * dx + dy * dy; // d11, d12, d21 and d22, squared
		// Sort out the two smallest distances
				
		// Cheat and pick only F1
		d.xy = min(d.xy, d.zw);
		d.x = min(d.x, d.y);
		return d.x; // F1 duplicated, F2 not computed
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    
    vec3 gColor = GlowSky(uv);
    vec3 bColor = BlueSky(uv);
    
    gColor = gColor.x*gColor.x+bColor*(1.-gColor.x);
	
    vec3 color = vec3( 0.0 );
	color += EvalPixel( fragCoord.xy                    );
	color += EvalPixel( fragCoord.xy + vec2( 0.5, 0.0 ) );
	color += EvalPixel( fragCoord.xy + vec2( 0.0, 0.5 ) );
	color += EvalPixel( fragCoord.xy + vec2( 0.5, 0.5 ) );
	
	color *= 0.25;
    
    gColor = gColor + color;
    
    //add some snow
    vec2 GA = vec2(0.);
    float speed = .2;
    GA.x -= iTime*1.8;
    GA.y += iTime*0.9;
    GA *= speed;
    float F1;
    uv.x = uv.x*iResolution.x/iResolution.y;
    F1 = 1. - worleyNoise((uv+GA*0.8+fbm(uv)*0.3)*8.1);
    F1 = smoothstep(0.995,1.0,F1);
    
   	float F2 = 1. - worleyNoise((uv+GA*0.4+fbm(uv)*0.2)*7.1);
    F2 = smoothstep(0.99,1.0,F2);
    
    float A = uv.x - (1.-uv.y)*.8;
    A = clamp(A,.0,1.);
    A = 1.-A;
    
    F1 = F1*A+F2*A*1.8;
    //F1 = F1*A;
    gColor = gColor*(1.-F1) + vec3(0.9,0.8,0.95)*F1;
    
	fragColor = vec4(gColor,1.0);
    //fragColor = vec4(F1);
    //fragColor = vec4(vec3(1.4,1.2,1.0)*LensFlare(uv),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}