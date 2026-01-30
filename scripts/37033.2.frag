#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 wind = vec3(0.1, 0.0, 0.0);

float hash( float n ) { return fract(sin(n)*753.5453123); }

float noise( in vec3 x )
{	
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);

    float n = p.x + p.y*157.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                   mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}    

#define octaves 7
float fbm2(vec3 pos) {
    float f = 0.;
    for (int i = 0; i < octaves; i++) { 
        f += noise(pos) / pow(2.0, float(i + 1)); 
        pos *= 2.01;
    } 
    f = f / (1.0 - 1.0 / pow(2.0, float(octaves + 1))); 
    return f; 
}

float fbm(vec3 p)
{
    float f;
    f = 0.5000*noise( p ); p = p*2.02;
    f += 0.2500*noise( p ); p = p*2.03;
    f += 0.1250*noise( p ); p = p*2.01;
    f += 0.0625*noise( p );
    return f;
}

float udBox( vec3 p, vec3 b )
{
  return length(max(abs(p)-b,0.0));
}

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float sdEllipsoid( in vec3 p, in vec3 r )
{
    return (length( p/r ) - 1.0) * min(min(r.x,r.y),r.z);
}

float map(in vec3 p)
{
	float f = fbm2(5.0*p + vec3(0.1,0.0,0.025)*time);
	float den = udBox(p, vec3(1.0, 0.5, 0.5));
	den = smoothstep(-0.1,0.25,den);
	den = -den-(sin(0.0)+1.)*0.35;
	return clamp( den +f, 0.0, 1.0 );
}

vec3 raymarch( in vec3 ro, in vec3 rd)
{
	vec4 sum = vec4( 0.0 );

	float t = 0.0;
	
	for( int i=0; i<100; i++ )
	{
		if( sum.a > 0.99 ) break;
		
		vec3 pos = ro + t*rd;
		float d = map( pos );
		vec4 col = vec4(mix( vec3(1.0,1.0,1.0), vec3(0.0), d ), 1.0);
		vec4 shadow = vec4(mix(vec3(1.0), vec3(0.07,0.15,0.6), d), 1.0);
		col += pow(shadow, vec4(6.0));
		
		col *= d*3.0;
		
		sum +=  col*(1.0 - sum.a);	
		
		t += 0.01;
	}

	vec4 sky_color = vec4(mix(sum.rgb, vec3(0.5, 0.5, 0.3), 1.0 - sum.a), 1.0);
	return clamp( sky_color.xyz, 0.0, 1.0 );
}

void main( void ) {

	vec2 q = (gl_FragCoord.xy / resolution.xy);
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	
	float rot = -1.0;
	vec3 ro = vec3(0.0, -0.25, 1.0);//4.0*normalize(vec3(cos(rot), .0, sin(rot)));
	vec3 ta = vec3(0.0);
	
	// build ray
	vec3 ww = normalize( ta - ro);
	vec3 uu = normalize(cross( vec3(0.,1.,0.), ww ));
	vec3 vv = normalize(cross(ww,uu));
	vec3 rd = normalize( uv.x*uu + uv.y*vv + 2.0*ww );
	
	// raymarch	
	vec4 cloud_color = vec4(raymarch( ro, rd), 1.0);
	
	gl_FragColor = cloud_color;

}