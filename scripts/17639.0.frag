#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// credit: iq/rgba

mat3 noiserot = mat3( 0.00,  0.80,  0.60,
              -0.80,  0.36, -0.48,
              -0.60, -0.48,  0.64 );

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float rand(vec3 co){
    return fract(sin(dot(co.xyz ,vec3(12.9898,78.233,47.985))) * 43758.5453);
}

float hash( float n )
{
    return fract(sin(n)*43758.5453);
}

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                        mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                    mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                        mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
    return res;
}

float fbm( vec3 p )
{
    float f;
    f  = 0.5000*noise( p );
    p = noiserot*p*2.02;
    f += 0.2500*noise( p );
    p = noiserot*p*2.03;
    f += 0.1250*noise( p );
    p = noiserot*p*2.01;
    f += 0.0625*noise( p );
    return f;
}

vec4 getLayers(vec2 p)
{
	float f = 0.15;
	// loose, snow, powder, n/a
	vec4 topleft =     vec4(2.0,0.0,0.0,0.0)*f;
	vec4 topright =    vec4(0.0,0.2,0.0,0.0)*f;
	vec4 bottomleft =  vec4(0.0,1.0,1.2,0.0)*f;
	vec4 bottomright = vec4(2.0,0.0,0.0,0.0)*f;
	
	return mix(mix(topleft,topright,p.x),mix(bottomleft,bottomright,p.x),p.y);
}
		
float getTopHeight(vec2 p)
{
	float topleft =     100.0;
	float topright =    100.0;
	float bottomleft =  100.0;
	float bottomright = 100.0;
	
	return mix(mix(topleft,topright,p.x),mix(bottomleft,bottomright,p.x),p.y);
}

vec4 getLayerNoise(vec2 p)
{
	vec4 n = vec4(0);
	
	
	n.r = fbm(vec3(p*2.0,0.0));
	n.g = fbm(vec3(p*32.0,0.0));
	n.b = fbm(vec3(p*128.0,0.0));
	n.a = fbm(vec3(p*8.0,0.0));
	
	return n;
}

vec4 layerNoiseAmplitude = vec4(0.1,0.02,0.001,0.5);// loose, snow, powder, rock

struct Layer
{
	vec4 isLayer;
	float h;
};

Layer getLayerHeights(vec2 p)
{
	Layer ret;
	vec4 l = getLayers(p);
	float t = getTopHeight(p);
	vec4 ln = getLayerNoise(p) * layerNoiseAmplitude;
	
	//return ln;
	
	float base = t - dot(l,vec4(1.0));
	
	vec4 lh = vec4(
		// rock layer height
		base + ln.a,
		
		// loose layer height
		base + l.r - ln.r,
		
		// snow layer height
		base + l.r + l.g - ln.g,
		
		// powder layer height
		t - ln.b
		);
	
	// max height
	float maxh = max(max(lh.r, lh.g),max(lh.b, lh.a));
	
	vec4 isLayer = step(vec4(maxh), lh);
	
	ret.isLayer = isLayer;
	ret.h = maxh;
	
	return ret;
}

vec3 getNormal(vec2 p)
{
	float t = 0.002;
	
	float h1 = getLayerHeights(p+vec2(-t,0)).h;
	float h2 = getLayerHeights(p+vec2(t,0)).h;
	float h3 = getLayerHeights(p+vec2(0,-t)).h;
	float h4 = getLayerHeights(p+vec2(0,t)).h;
	
	return normalize(vec3(h4-h3,2.0*t,h2-h1));
}




void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * vec2(1.0,-1.0);
	
	vec3 col = vec3(0);

	Layer lh;
	lh = getLayerHeights(position);
	
	//col = lh.isLayer.rgb + vec3(lh.isLayer.a);
	
	vec3 rock = vec3(144,96,87) / 255.0;
	vec3 dirt = vec3(193,121,85) / 255.0;
	vec3 snow = vec3(247,250,255) / 255.0;
	vec3 powder = vec3(247,250,255) *0.95 / 255.0;
	
	col = 	rock * lh.isLayer.r + 
		dirt * lh.isLayer.g + 
		snow * lh.isLayer.b + 
		powder * lh.isLayer.a;
	
	vec3 n = getNormal(position);
	
	//col = vec3(0.5) + n * 0.5;
	
	vec3 l = normalize(vec3(1.0,2.0,1.0));
	col *= (0.2 + max(0.0,dot(n,l)));
	
	
	//col.r = fbm(vec3(position*8.0,0.0));
	//col.g = fbm(vec3(position*2.0,0.0));
	//col.b = fbm(vec3(position*32.0,0.0));
	//col.r -= mod(col.r,0.05);


	gl_FragColor = vec4( col, 1.0 );

}
