// skype: alien 5ive
// modified by Necip's


#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
#define iTime time
#define iResolution resolution
const vec4 iMouse = vec4(0.0);

// #define POSTPROCESS
#define RAYMARCHING_STEP 25
#define RAYMARCHING_JUMP 1.



float mandelBrot(vec2 p) {
	p.x = p.x * 3.5 - 2.5;
	p.y = p.y * 2.0 - 1.0;
	
	vec2 xy = vec2(0.);
	int itter = 0;
	const int maxItter = 128;
	
	for(int i = 0; i < maxItter; i++) {
		if (dot(xy, xy) > 4.) {
			break;	
		}
		
		float xtemp = dot(vec2(xy.x, -xy.y), xy) + p.x;
		xy.y = 2.0 * xy.x * xy.y + p.y;
		xy.x = xtemp;
		itter++;
	}
	
	return float(itter) / float(maxItter);
}

const float PI = 3.14159265359;

float castRay( in vec3 ro, in vec3 rd, inout float depth )
{
	float t = 0.0;
	float res;
	for( int i=0; i<RAYMARCHING_STEP; i++ )
	{
		vec3 pos = ro+rd*t;
		res = -25. + pos.y;
		if( res < 0.01 || t > 150. ) break;
		t += res*RAYMARCHING_JUMP;
		depth += 1./float(RAYMARCHING_STEP);
	}
	return t;
}

vec3 render( in vec3 ro, in vec3 rd, in vec2 uv )
{
    float depth = 0.;
    float t = castRay(ro,rd,depth);
    vec3 color = vec3(depth*uv.y,depth/5.,depth);
    color += smoothstep(0.3,0.6,depth)*vec3(0.2,0.2,0.1);
    color += smoothstep(0.6,1.,depth)*vec3(0.2,0.8,0.1);
    return color;
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr), 0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
	return mat3( cu, cv, cw );
}

vec3 orbit(float phi, float theta, float radius)
{
	return vec3(
		radius * sin( phi ) * cos( theta ),
		radius * cos( phi ) + cos( theta ),
		radius * sin( phi ) * sin( theta )
	);
}

void mainImage( out vec4 fragColor, in vec2 coords )
{
	float time = iTime;
	vec2 uv = coords.xy / iResolution.xy;
	vec2 mouse = iMouse.xy / iResolution.xy;
	vec2 q = coords.xy/iResolution.xy;
	vec2 p = -1.0+2.0*q;
	p.x *= iResolution.x/iResolution.y;

	
	//Camera
	float radius = 60.;
	vec3 ro = orbit(PI/2.-.5,PI/1.+sin(time)*.1,radius);
	
	vec3 ta  = vec3(0.0, 0., 0.0);
	ta.z += mandelBrot(uv)*50.;
	
	mat3 ca = setCamera( ro, ta, 0.9 );
	vec3 rd = ca * normalize( vec3(p.xy,1.2) );
	rd.y += mandelBrot(vec2(rd.x, rd.y));

	
	
	vec3 color = render( ro, rd, uv );	
	fragColor = vec4(color,1.0);
}

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}